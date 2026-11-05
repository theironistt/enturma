import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Award, BookOpen, Camera, Check, ChevronRight,
  CircleDollarSign, Clock3, Flame, History, Info, Medal, MessageCircle, Music2, Plus,
  RotateCcw, ShieldCheck, Sparkles, Ticket, Trash2, Trophy, UserRound, Users, X, Zap
} from 'lucide-react';
import {
  completeActiveChallenge, completeExtraCard, completeGroupChallenge, createGame, declineExtraCard, difficultyLabel,
  drawExtraCard, drawGroupChallenge, finishNight, finishPlayer, getPlayer, getRanking, modeLabel, skipActiveChallenge,
  toggleGroupChallengePlayer,
  usePass
} from './services/gameEngine';
import { clearSavedGame, loadGame, saveGame } from './services/storage';
import type { Challenge, Game, GameMode, GroupChallenge, Player, PlayerDraft } from './types/game';

const PLAYER_COLORS = ['#8B5CF6', '#F43F7B', '#34D399', '#FBBF24', '#38BDF8', '#FB7185', '#A78BFA', '#2DD4BF', '#F97316', '#60A5FA', '#E879F9', '#84CC16'];
const modeDescription: Record<GameMode, string> = {
  social: 'Conversa, descoberta, humor e interações leves.',
  ousado: 'Mais aproximação, dança, drinks e troca de contatos.',
  'capetinha-roxo': 'A noite sem freio: flerte, romance e missões épicas.'
};
const categoryIcon: Record<string, typeof Sparkles> = {
  'quebra-gelo': MessageCircle, 'investigação social': Info, 'bar e bebidas': CircleDollarSign,
  'foto e vídeo': Camera, 'redes sociais': Zap, flerte: Flame, romance: Sparkles,
  'dança e performance': Music2, 'bilhetes e mensagens': Ticket, 'missões épicas': Trophy
};

type Screen = 'home' | 'howto' | 'setup' | 'dashboard' | 'player' | 'ranking' | 'history' | 'end';
type ModalType = 'capetinha' | 'skip' | 'end-night' | 'delete' | 'new-night' | 'extra-decline' | null;

function App() {
  const [game, setGame] = useState<Game | null>(() => loadGame());
  const [screen, setScreen] = useState<Screen>(() => {
    const saved = loadGame();
    return saved?.status === 'finished' ? 'end' : 'home';
  });
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [setupName, setSetupName] = useState('');
  const [setupMode, setSetupMode] = useState<GameMode>('social');
  const [drafts, setDrafts] = useState<PlayerDraft[]>([
    { name: '', color: PLAYER_COLORS[0] }, { name: '', color: PLAYER_COLORS[1] }
  ]);
  const [pendingStart, setPendingStart] = useState<{ name: string; mode: GameMode; drafts: PlayerDraft[] } | null>(null);

  useEffect(() => {
    if (game) saveGame(game);
  }, [game]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const activePlayer = useMemo(() => game && activePlayerId ? getPlayer(game, activePlayerId) : undefined, [game, activePlayerId]);

  function beginNewNight() {
    setSetupName('');
    setSetupMode('social');
    setDrafts([{ name: '', color: PLAYER_COLORS[0] }, { name: '', color: PLAYER_COLORS[1] }]);
    setScreen('setup');
  }

  function requestStart() {
    const cleanDrafts = drafts.map((draft) => ({ ...draft, name: draft.name.trim() })).filter((draft) => draft.name);
    if (cleanDrafts.length < 2) {
      setToast('Adicione pelo menos duas pessoas para começar.');
      return;
    }
    if (new Set(cleanDrafts.map((draft) => draft.name.toLocaleLowerCase())).size !== cleanDrafts.length) {
      setToast('Use nomes diferentes para cada participante.');
      return;
    }
    const payload = { name: setupName.trim() || 'Nossa noite', mode: setupMode, drafts: cleanDrafts };
    if (setupMode === 'capetinha-roxo') {
      setPendingStart(payload);
      setModal('capetinha');
      return;
    }
    startGame(payload);
  }

  function startGame(payload: { name: string; mode: GameMode; drafts: PlayerDraft[] }) {
    const next = createGame(payload.name, payload.mode, payload.drafts);
    setGame(next);
    setActivePlayerId(null);
    setModal(null);
    setPendingStart(null);
    setScreen('dashboard');
  }

  function updateDraft(index: number, patch: Partial<PlayerDraft>) {
    setDrafts((current) => current.map((draft, i) => i === index ? { ...draft, ...patch } : draft));
  }

  function addDraft() {
    if (drafts.length >= 12) return;
    setDrafts((current) => [...current, { name: '', color: PLAYER_COLORS[current.length % PLAYER_COLORS.length] }]);
  }

  function removeDraft(index: number) {
    if (drafts.length <= 2) return;
    setDrafts((current) => current.filter((_, i) => i !== index));
  }

  function openPlayer(playerId: string) {
    setActivePlayerId(playerId);
    setScreen('player');
  }

  function updateGame(next: Game, feedback?: string) {
    setGame(next);
    if (feedback) setToast(feedback);
  }

  function completeChallenge() {
    if (!game || !activePlayerId || !activePlayer?.activeChallenge) return;
    const challenge = activePlayer.activeChallenge;
    const next = completeActiveChallenge(game, activePlayerId);
    updateGame(next, `+${challenge.points} pontos · missão cumprida`);
  }

  function passChallenge() {
    if (!game || !activePlayerId || !activePlayer?.activeChallenge) return;
    updateGame(usePass(game, activePlayerId), `Passe usado · restam ${Math.max(0, activePlayer.passesRemaining - 1)}`);
  }

  function requestSkip() {
    if (activePlayer?.passesRemaining === 0) setModal('skip');
  }

  function confirmSkip() {
    if (!game || !activePlayerId) return;
    updateGame(skipActiveChallenge(game, activePlayerId), 'Desafio pulado · espaço consumido');
    setModal(null);
  }

  function chooseExtra() {
    if (!game || !activePlayerId) return;
    updateGame(drawExtraCard(game, activePlayerId), 'Carta Extra na mesa.');
  }

  function finishWithoutExtra() {
    if (!game || !activePlayerId) return;
    updateGame(declineExtraCard(game, activePlayerId), 'Você encerrou com 10 desafios concluídos.');
    setModal(null);
  }

  function completeExtra() {
    if (!game || !activePlayerId) return;
    updateGame(completeExtraCard(game, activePlayerId), 'Carta Extra concluída · bônus incluído');
  }

  function spinGroupChallenge() {
    if (!game) return;
    if (game.activeGroupChallenge) {
      setToast('Concluam o desafio coletivo atual antes de girar outro.');
      return;
    }
    updateGame(drawGroupChallenge(game), 'Desafio coletivo sorteado para toda a roda.');
  }

  function finishGroupChallenge() {
    if (!game || !game.activeGroupChallenge) return;
    const selectedCount = game.activeGroupChallenge.completedPlayerIds?.length ?? 0;
    updateGame(completeGroupChallenge(game), `Desafio coletivo concluído por ${selectedCount} pessoa${selectedCount === 1 ? '' : 's'}.`);
  }

  function toggleGroupPlayer(playerId: string) {
    if (!game || !game.activeGroupChallenge) return;
    setGame(toggleGroupChallengePlayer(game, playerId));
  }

  function closePlayer() {
    setScreen('dashboard');
    setActivePlayerId(null);
  }

  function confirmEndNight() {
    if (!game) return;
    updateGame(finishNight(game), 'Noite encerrada.');
    setModal(null);
    setScreen('end');
  }

  function deleteSaved() {
    clearSavedGame();
    setGame(null);
    setModal(null);
    setScreen('home');
    setToast('Partida salva excluída.');
  }

  function playAgain() {
    if (!game) return;
    const nextDrafts = game.players.map((player) => ({ name: player.name, color: player.color }));
    setSetupName(`${game.name} · revanche`);
    setSetupMode(game.mode);
    setDrafts(nextDrafts);
    setScreen('setup');
  }

  function newNightFromEnd() {
    clearSavedGame();
    setGame(null);
    beginNewNight();
    setModal(null);
  }

  return <div className="app-shell">
    <div className="ambient-glow ambient-glow-one" />
    <div className="ambient-glow ambient-glow-two" />
    <main className="app-main">
      {screen === 'home' && <HomeScreen hasSaved={Boolean(game)} onStart={beginNewNight} onHowTo={() => setScreen('howto')} onContinue={() => setScreen(game?.status === 'finished' ? 'end' : 'dashboard')} onDelete={() => setModal('delete')} />}
      {screen === 'howto' && <HowToScreen onBack={() => setScreen('home')} />}
      {screen === 'setup' && <SetupScreen name={setupName} mode={setupMode} drafts={drafts} onName={setSetupName} onMode={setSetupMode} onDraft={updateDraft} onAdd={addDraft} onRemove={removeDraft} onBack={() => setScreen('home')} onStart={requestStart} />}
      {screen === 'dashboard' && game && <DashboardScreen game={game} onOpen={openPlayer} onRanking={() => setScreen('ranking')} onEnd={() => setModal('end-night')} onSpinGroup={spinGroupChallenge} onToggleGroupPlayer={toggleGroupPlayer} onCompleteGroup={finishGroupChallenge} />}
      {screen === 'player' && game && activePlayer && <PlayerScreen game={game} player={activePlayer} onBack={closePlayer} onComplete={completeChallenge} onPass={passChallenge} onSkip={requestSkip} onHistory={() => setScreen('history')} onDrawExtra={chooseExtra} onDeclineExtra={() => setModal('extra-decline')} onCompleteExtra={completeExtra} />}
      {screen === 'ranking' && game && <RankingScreen game={game} onBack={() => setScreen('dashboard')} />}
      {screen === 'history' && game && activePlayer && <HistoryScreen player={activePlayer} onBack={() => setScreen('player')} />}
      {screen === 'end' && game && <EndScreen game={game} onAgain={playAgain} onNew={() => setModal('new-night')} />}
    </main>
    {toast && <div className="toast" role="status"><Check size={16} />{toast}</div>}
    {modal === 'capetinha' && <ConfirmModal icon={<Flame size={22} />} eyebrow="Antes de começar" title="Capetinha Roxo é intenso." text="Este modo inclui desafios de flerte, bebidas, fotos, redes sociais e aproximações românticas. Cada participante decide o que deseja realizar." secondary="Voltar" primary="Começar mesmo assim" onSecondary={() => { setModal(null); setPendingStart(null); }} onPrimary={() => pendingStart && startGame(pendingStart)} />}
    {modal === 'skip' && <ConfirmModal icon={<AlertTriangle size={22} />} eyebrow="Sem passes" title="Pular sem substituir?" text="Este desafio será contado entre os 10 da noite e não dará pontos. Você não receberá uma missão substituta para este espaço." secondary="Voltar" primary="Pular desafio" onSecondary={() => setModal(null)} onPrimary={confirmSkip} danger />}
    {modal === 'end-night' && <ConfirmModal icon={<Clock3 size={22} />} eyebrow="Pausa na pista" title="Encerrar a noite?" text="A partida será finalizada agora. O ranking atual será preservado e você poderá ver o resultado final." secondary="Continuar jogando" primary="Encerrar noite" onSecondary={() => setModal(null)} onPrimary={confirmEndNight} danger />}
    {modal === 'delete' && <ConfirmModal icon={<Trash2 size={22} />} eyebrow="Partida salva" title="Excluir esta noite?" text="A partida salva será apagada deste celular. Essa ação não pode ser desfeita." secondary="Manter partida" primary="Excluir partida" onSecondary={() => setModal(null)} onPrimary={deleteSaved} danger />}
    {modal === 'new-night' && <ConfirmModal icon={<RotateCcw size={22} />} eyebrow="Resultado salvo" title="Começar uma nova noite?" text="O resultado atual continuará visível apenas até você criar a próxima noite. Os participantes podem ser reaproveitados depois." secondary="Ficar no resultado" primary="Nova noite" onSecondary={() => setModal(null)} onPrimary={newNightFromEnd} />}
    {modal === 'extra-decline' && <ConfirmModal icon={<Sparkles size={22} />} eyebrow="Carta Extra" title="Encerrar por aqui?" text="Você completou os 10 desafios. A Carta Extra é opcional e não muda seu resultado regular." secondary="Quero arriscar" primary="Encerrar por aqui" onSecondary={() => setModal(null)} onPrimary={finishWithoutExtra} />}
  </div>;
}

function Brand({ compact = false }: { compact?: boolean }) {
  return <div className={`brand ${compact ? 'brand-compact' : ''}`}><span className="brand-mark"><Sparkles size={compact ? 15 : 19} /></span><span>Enturma</span></div>;
}

function HomeScreen({ hasSaved, onStart, onHowTo, onContinue, onDelete }: { hasSaved: boolean; onStart: () => void; onHowTo: () => void; onContinue: () => void; onDelete: () => void }) {
  return <section className="screen home-screen screen-enter">
    <div className="home-top"><Brand /><span className="version-pill">MVP · 1.0</span></div>
    <div className="hero-copy">
      <div className="eyebrow"><span className="eyebrow-dot" /> jogo social para uma noite inteira</div>
      <h1>Sua missão é<br /><em>se divertir</em> na liga da justiça.</h1>
      <p>Um celular. A sua roda de amigos com dez missões para criar histórias com quem você ainda não conhece.</p>
    </div>
    <div className="hero-card">
      <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
      <div className="hero-card-icon"><Users size={25} /></div>
      <div><strong>O rolê começa quando você se passa e faz história com seus amigos:</strong><span>desafios individuais e em grupo, foguete que tem ré é só do Elon Musk.</span></div>
      <Sparkles className="hero-spark" size={18} />
    </div>
    <div className="home-actions">
      {hasSaved && <button className="button button-primary button-large" onClick={onContinue}><RotateCcw size={19} /> Continuar noite <ArrowRight size={18} /></button>}
      <button className={`button ${hasSaved ? 'button-secondary' : 'button-primary'} button-large`} onClick={onStart}><Zap size={19} /> Começar uma noite <ArrowRight size={18} /></button>
      <button className="button button-ghost button-large" onClick={onHowTo}><BookOpen size={18} /> Como jogar</button>
      {hasSaved && <button className="text-button danger-text" onClick={onDelete}><Trash2 size={14} /> Excluir partida salva</button>}
    </div>
    <div className="home-foot"><span><ShieldCheck size={14} /> sem login</span><span><Clock3 size={14} /> cada um no seu ritmo</span><span><CircleDollarSign size={14} /> gratuito</span></div>
  </section>;
}

function HowToScreen({ onBack }: { onBack: () => void }) {
  const steps = [
    { icon: Users, title: 'Um celular na roda', text: 'Uma pessoa abre o Enturma e o aparelho passa de mão em mão.' },
    { icon: Ticket, title: '10 espaços por pessoa', text: 'Cada jogador recebe missões individuais e avança sem esperar ninguém.' },
    { icon: RotateCcw, title: 'Três passes', text: 'Troque uma missão sem gastar espaço. Depois, pular consome um dos 10.' },
    { icon: Trophy, title: 'Pontos e Carta Extra', text: 'Complete 10 para desbloquear uma missão bônus roxa. Vence quem pontuar mais.' }
  ];
  return <section className="screen narrow-screen screen-enter"><TopBar title="Como jogar" onBack={onBack} /><div className="intro-block"><div className="eyebrow">quatro combinados rápidos</div><h2>O jogo é simples.<br /><em>A noite, não.</em></h2><p>O combinado é confiança, bom senso e liberdade para cada pessoa escolher seus limites.</p></div><div className="howto-list">{steps.map(({ icon: Icon, title, text }, index) => <div className="howto-card" key={title}><div className="step-number">0{index + 1}</div><div className="howto-icon"><Icon size={20} /></div><div><strong>{title}</strong><p>{text}</p></div></div>)}</div><div className="info-callout"><Info size={17} /><span>Passou dos passes? “Pular sem substituir” conta um espaço, mas não dá pontos.</span></div></section>;
}

function SetupScreen({ name, mode, drafts, onName, onMode, onDraft, onAdd, onRemove, onBack, onStart }: { name: string; mode: GameMode; drafts: PlayerDraft[]; onName: (value: string) => void; onMode: (value: GameMode) => void; onDraft: (index: number, patch: Partial<PlayerDraft>) => void; onAdd: () => void; onRemove: (index: number) => void; onBack: () => void; onStart: () => void }) {
  return <section className="screen setup-screen screen-enter"><TopBar title="Criar uma noite" onBack={onBack} /><div className="setup-intro"><div className="eyebrow">primeiro, o combinado</div><h2>Quem está<br /><em>na missão?</em></h2></div><label className="field-label" htmlFor="night-name">Nome da noite <span>opcional</span></label><input id="night-name" className="text-input" value={name} onChange={(event) => onName(event.target.value)} placeholder="Ex.: Sexta no centro" maxLength={40} />
    <div className="section-heading"><div><span className="eyebrow">modo da noite</span><h3>Escolha a temperatura</h3></div><span className="participant-count">{drafts.length}/12</span></div>
    <div className="mode-grid">{(['social', 'ousado', 'capetinha-roxo'] as GameMode[]).map((item) => <button type="button" key={item} className={`mode-card ${mode === item ? 'selected' : ''} mode-${item}`} onClick={() => onMode(item)}><span className="mode-card-top"><span className="mode-dot" />{modeLabel[item]}{mode === item && <Check size={16} />}</span><span>{modeDescription[item]}</span></button>)}</div>
    <div className="section-heading participant-heading"><div><span className="eyebrow">participantes</span><h3>Adicione a sua roda</h3></div><button className="icon-button" onClick={onAdd} disabled={drafts.length >= 12} aria-label="Adicionar participante"><Plus size={19} /></button></div>
    <div className="participant-list">{drafts.map((draft, index) => <div className="participant-row" key={`${index}-${draft.color}`}><span className="avatar-dot" style={{ background: draft.color }}>{draft.name.trim() ? draft.name.trim().slice(0, 1).toUpperCase() : index + 1}</span><input className="text-input participant-input" value={draft.name} onChange={(event) => onDraft(index, { name: event.target.value })} placeholder={`Pessoa ${index + 1}`} maxLength={24} aria-label={`Nome do participante ${index + 1}`} /><div className="color-picker">{PLAYER_COLORS.slice(0, 6).map((color) => <button type="button" key={color} className={`color-swatch ${draft.color === color ? 'chosen' : ''}`} style={{ background: color }} onClick={() => onDraft(index, { color })} aria-label={`Escolher cor ${color}`} />)}</div>{drafts.length > 2 && <button className="remove-button" onClick={() => onRemove(index)} aria-label={`Remover participante ${index + 1}`}><X size={17} /></button>}</div>)}</div>
    <button className="button button-primary button-large sticky-action" onClick={onStart}><Sparkles size={18} /> Começar a noite <ArrowRight size={18} /></button>
  </section>;
}

function DashboardScreen({ game, onOpen, onRanking, onEnd, onSpinGroup, onToggleGroupPlayer, onCompleteGroup }: { game: Game; onOpen: (id: string) => void; onRanking: () => void; onEnd: () => void; onSpinGroup: () => void; onToggleGroupPlayer: (playerId: string) => void; onCompleteGroup: () => void }) {
  const completed = game.players.reduce((total, player) => total + player.completedChallenges, 0);
  return <section className="screen dashboard-screen screen-enter"><header className="dashboard-header"><Brand compact /><div className="header-actions"><button className="small-action" onClick={onRanking}><Trophy size={16} /> Ranking</button><button className="icon-button muted-icon" onClick={onEnd} aria-label="Encerrar noite"><Clock3 size={18} /></button></div></header><div className="night-heading"><div><div className="eyebrow">{modeLabel[game.mode]} <span className="heading-separator">·</span> partida ativa</div><h2>{game.name}</h2></div><div className="night-total"><strong>{completed}</strong><span>missões<br />cumpridas</span></div></div><div className="dashboard-tip"><Sparkles size={16} /><span>Toque em uma pessoa para abrir a missão dela. Cada jogador tem um caminho diferente.</span></div><GroupChallengeCard challenge={game.activeGroupChallenge ?? null} players={game.players} completedCount={game.groupChallengeHistory?.length ?? 0} onSpin={onSpinGroup} onTogglePlayer={onToggleGroupPlayer} onComplete={onCompleteGroup} /><div className="player-grid">{game.players.map((player) => <PlayerCard key={player.id} player={player} onOpen={() => onOpen(player.id)} />)}</div><div className="dashboard-footer"><span><ShieldCheck size={14} /> Jogo baseado na confiança da roda</span></div></section>;
}

function GroupChallengeCard({ challenge, players, completedCount, onSpin, onTogglePlayer, onComplete }: { challenge: GroupChallenge | null; players: Player[]; completedCount: number; onSpin: () => void; onTogglePlayer: (playerId: string) => void; onComplete: () => void }) {
  const selected = new Set(challenge?.completedPlayerIds ?? []);
  return <section className={`group-challenge-card ${challenge ? 'group-challenge-active' : ''}`}><div className="group-card-heading"><div><span className="eyebrow"><Users size={13} /> desafio coletivo</span><h3>{challenge ? challenge.title : 'Uma missão para a roda inteira'}</h3></div><span className="group-count">{completedCount} feitos</span></div>{challenge ? <><p>{challenge.description}</p><div className="group-card-meta"><span><CircleDollarSign size={14} /> +{challenge.points} para cada concluinte</span><span>{selected.size}/{players.length} marcados</span></div><div className="group-player-list">{players.map((player) => <button key={player.id} className={`group-player-toggle ${selected.has(player.id) ? 'selected' : ''}`} onClick={() => onTogglePlayer(player.id)}><span className="avatar-dot" style={{ background: player.color }}>{player.name.slice(0, 1).toUpperCase()}</span><span>{player.name}</span>{selected.has(player.id) && <Check size={16} />}</button>)}</div><button className="button button-primary" onClick={onComplete} disabled={!selected.size}><Check size={17} /> Confirmar {selected.size || ''} concluinte{selected.size === 1 ? '' : 's'}</button></> : <><p>Gire quando quiser uma pausa nas missões individuais. Marque apenas quem realmente concluiu; cada pessoa selecionada ganha os pontos.</p><button className="button button-secondary" onClick={onSpin}><RotateCcw size={17} /> Girar desafio coletivo</button></>}</section>;
}

function PlayerCard({ player, onOpen }: { player: Player; onOpen: () => void }) {
  const challenge = player.activeChallenge;
  return <button className={`player-card ${player.status === 'finished' ? 'is-finished' : ''}`} onClick={onOpen} style={{ '--player-color': player.color } as React.CSSProperties}>
    <div className="player-card-accent" /><div className="player-card-head"><div className="player-identity"><span className="avatar-dot" style={{ background: player.color }}>{player.name.slice(0, 1).toUpperCase()}</span><span><strong>{player.name}</strong><small>{player.status === 'finished' ? 'Finalizou' : 'Na missão'}</small></span></div><span className="player-score"><span>{player.score}</span> pts</span></div>
    {challenge ? <><div className="card-challenge"><span className="category-label">{challenge.category}</span><strong>{challenge.title}</strong><span className="challenge-preview">{challenge.description}</span></div><div className="card-meta"><span className={`difficulty-pill difficulty-${challenge.difficulty}`}>{difficultyLabel[challenge.difficulty]} · {challenge.points} pts</span><span>{player.completedChallenges}/10</span></div></> : player.extraCardUnlocked && !player.extraCardUsed ? <div className="extra-unlocked"><Sparkles size={17} /><strong>Carta Extra disponível</strong><span>Você chegou ao fim. Quer arriscar?</span></div> : <div className="finished-summary"><Check size={17} /><strong>10 espaços utilizados</strong><span>{player.completedChallenges} concluídos · {player.score} pontos</span></div>}
    <div className="card-footer"><span>{player.usedSlots}/10 espaços <span className="footer-divider">·</span> {player.passesRemaining} passes</span><ChevronRight size={17} /></div>
  </button>;
}

function PlayerScreen({ game, player, onBack, onComplete, onPass, onSkip, onHistory, onDrawExtra, onDeclineExtra, onCompleteExtra }: { game: Game; player: Player; onBack: () => void; onComplete: () => void; onPass: () => void; onSkip: () => void; onHistory: () => void; onDrawExtra: () => void; onDeclineExtra: () => void; onCompleteExtra: () => void }) {
  const challenge = player.activeChallenge;
  const extraReady = player.extraCardUnlocked && !player.extraCardUsed;
  const extraCard = player.extraCardUsed && player.extraCardChallenge;
  return <section className="screen player-screen screen-enter"><TopBar title={player.name} onBack={onBack} right={<button className="small-action" onClick={onHistory}><History size={15} /> Histórico</button>} />
    <div className="player-progress-head"><div><span className="eyebrow">espaço {Math.min(10, player.usedSlots + 1)} de 10</span><h2>{player.status === 'finished' ? 'Missão cumprida.' : extraReady || extraCard ? 'O último risco.' : 'Puxa a próxima.'}</h2></div><div className="score-lockup"><strong>{player.score}</strong><span>pontos</span></div></div>
    <ProgressBar value={player.usedSlots} max={10} color={player.color} />
    {extraReady && <div className="extra-choice-card"><div className="extra-card-badge"><Sparkles size={16} /> carta extra</div><h3>Você completou os 10 desafios!</h3><p>Quer arriscar uma missão bônus roxa? Ela é opcional e não muda o resultado regular.</p><div className="extra-choice-actions"><button className="button button-purple" onClick={onDrawExtra}><Sparkles size={17} /> Sortear Carta Extra</button><button className="button button-ghost" onClick={onDeclineExtra}>Encerrar por aqui</button></div></div>}
    {extraCard && <ExtraCard challenge={extraCard} score={player.score} onComplete={onCompleteExtra} onDecline={onDeclineExtra} />}
    {!extraReady && !extraCard && challenge && <ChallengeCard challenge={challenge} player={player} onComplete={onComplete} onPass={onPass} onSkip={onSkip} />}
    {!extraReady && !extraCard && !challenge && <div className="empty-state"><Award size={28} /><h3>Essa missão terminou.</h3><p>Volte para a roda e abra outro jogador.</p><button className="button button-secondary" onClick={onBack}>Voltar ao painel</button></div>}
  </section>;
}

function ChallengeCard({ challenge, player, onComplete, onPass, onSkip }: { challenge: Challenge; player: Player; onComplete: () => void; onPass: () => void; onSkip: () => void }) {
  const Icon = categoryIcon[challenge.category] ?? Sparkles;
  return <div className={`mission-card mission-${challenge.difficulty}`}><div className="mission-card-top"><span className="category-badge"><Icon size={15} /> {challenge.category}</span><span className={`difficulty-pill difficulty-${challenge.difficulty}`}>{difficultyLabel[challenge.difficulty]}</span></div><div className="mission-card-copy"><span className="mission-kicker">missão para {player.name}</span><h1>{challenge.title}</h1><p>{challenge.description}</p></div><div className="mission-points"><CircleDollarSign size={19} /><strong>+{challenge.points}</strong><span>pontos ao concluir</span></div><div className="mission-actions"><button className="button button-success button-large" onClick={onComplete}><Check size={20} /> Consegui</button>{player.passesRemaining > 0 ? <button className="button button-secondary button-large" onClick={onPass}><RotateCcw size={18} /> Usar passe <span className="button-detail">· restam {player.passesRemaining}</span></button> : <button className="button button-ghost button-large skip-action" onClick={onSkip}><ArrowRight size={18} /> Pular sem substituir</button>}</div><div className="mission-note"><ShieldCheck size={14} /> Faça apenas o que fizer sentido para você e para a outra pessoa.</div></div>;
}

function ExtraCard({ challenge, score, onComplete, onDecline }: { challenge: Challenge; score: number; onComplete: () => void; onDecline: () => void }) {
  const Icon = categoryIcon[challenge.category] ?? Sparkles;
  return <div className="mission-card extra-card"><div className="extra-card-shine" /><div className="mission-card-top"><span className="category-badge"><Sparkles size={15} /> Carta Extra</span><span className="difficulty-pill difficulty-epica">{difficultyLabel[challenge.difficulty]}</span></div><div className="mission-card-copy"><span className="mission-kicker">bônus final · {challenge.category}</span><h1>{challenge.title}</h1><p>{challenge.description}</p></div><div className="mission-points"><Icon size={19} /><strong>+{challenge.points + 10}</strong><span>pontos · já inclui +10 bônus</span></div><div className="mission-actions"><button className="button button-purple button-large" onClick={onComplete}><Sparkles size={19} /> Consegui</button><button className="button button-ghost button-large" onClick={onDecline}>Encerrar sem concluir</button></div><div className="mission-note"><Award size={14} /> Sua pontuação atual é {score} pontos. Sem passe nesta carta.</div></div>;
}

function RankingScreen({ game, onBack }: { game: Game; onBack: () => void }) {
  const ranking = getRanking(game);
  return <section className="screen narrow-screen screen-enter"><TopBar title="Ranking" onBack={onBack} /><div className="ranking-hero"><div className="eyebrow">quem está deixando marca</div><h2>A noite tem<br /><em>um placar.</em></h2><p>Os empates são decididos por missões concluídas, depois por menos espaços pulados.</p></div><div className="ranking-list">{ranking.map((player, index) => <div className={`ranking-row rank-${index + 1}`} key={player.id}><div className="rank-position">{index === 0 ? <Trophy size={17} /> : index + 1}</div><span className="avatar-dot" style={{ background: player.color }}>{player.name.slice(0, 1).toUpperCase()}</span><div className="rank-person"><strong>{player.name}</strong><small>{player.completedChallenges}/10 concluídos · {player.usedSlots} espaços</small></div><div className="rank-score"><strong>{player.score}</strong><span>pts</span></div></div>)}</div><div className="ranking-legend"><span><span className="legend-dot gold" /> maior pontuação</span><span><span className="legend-dot purple" /> melhor desempate</span></div></section>;
}

function HistoryScreen({ player, onBack }: { player: Player; onBack: () => void }) {
  const history = [...player.history].reverse();
  return <section className="screen narrow-screen screen-enter"><TopBar title={`Histórico · ${player.name}`} onBack={onBack} /><div className="history-summary"><div><span className="eyebrow">linha da noite</span><h2>{player.completedChallenges} <small>missões concluídas</small></h2></div><span className="history-score">{player.score} pts</span></div><div className="history-list">{history.length ? history.map((item) => <HistoryItem key={item.id} item={item} />) : <div className="empty-state compact"><History size={24} /><p>Ainda não há movimentos para mostrar.</p></div>}</div></section>;
}

function HistoryItem({ item }: { item: Player['history'][number] }) {
  const completed = item.status === 'completed' || item.status === 'extra-completed';
  const bonus = item.status === 'bonus';
  return <div className={`history-item ${completed ? 'history-complete' : ''} ${bonus ? 'history-bonus' : ''}`}><div className="history-status">{completed ? <Check size={16} /> : bonus ? <Award size={16} /> : item.status === 'passed' ? <RotateCcw size={16} /> : item.status === 'extra-declined' ? <Sparkles size={16} /> : <ArrowRight size={16} />}</div><div className="history-copy"><strong>{item.label ?? item.challenge?.title ?? 'Movimento da noite'}</strong><span>{item.challenge ? `${item.challenge.category} · ${difficultyLabel[item.challenge.difficulty]}` : 'Bônus automático'}</span></div><strong className="history-points">{item.pointsEarned > 0 ? `+${item.pointsEarned}` : '—'}</strong></div>;
}

function EndScreen({ game, onAgain, onNew }: { game: Game; onAgain: () => void; onNew: () => void }) {
  const ranking = getRanking(game);
  const winner = ranking[0];
  const mostActive = [...game.players].sort((a, b) => b.completedChallenges - a.completedChallenges || a.order - b.order)[0];
  const purpleStar = [...game.players].sort((a, b) => b.history.filter((item) => item.challenge && (item.challenge.difficulty === 'ousada' || item.challenge.difficulty === 'epica') && (item.status === 'completed' || item.status === 'extra-completed')).length - a.history.filter((item) => item.challenge && (item.challenge.difficulty === 'ousada' || item.challenge.difficulty === 'epica') && (item.status === 'completed' || item.status === 'extra-completed')).length)[0];
  return <section className="screen end-screen screen-enter"><div className="end-top"><Brand compact /><span className="ended-pill"><Check size={13} /> noite encerrada</span></div><div className="end-hero"><div className="trophy-orbit"><Trophy size={28} /></div><div className="eyebrow">resultado final</div><h1>{winner?.name}<br /><em>levou a noite.</em></h1><p>{winner?.score ?? 0} pontos · {winner?.completedChallenges ?? 0} missões concluídas</p></div><div className="highlights"><Highlight icon={<Trophy size={17} />} label="Vencedor" name={winner?.name ?? '—'} value={`${winner?.score ?? 0} pts`} /><Highlight icon={<Zap size={17} />} label="Mais desenrolado" name={mostActive?.name ?? '—'} value={`${mostActive?.completedChallenges ?? 0} concluídas`} /><Highlight icon={<Flame size={17} />} label="Capetinha Roxo" name={purpleStar?.name ?? '—'} value="ousadia em alta" /></div><div className="final-ranking">{ranking.map((player, index) => <div className="final-rank-row" key={player.id}><span>{String(index + 1).padStart(2, '0')}</span><span className="avatar-dot small-avatar" style={{ background: player.color }}>{player.name.slice(0, 1).toUpperCase()}</span><strong>{player.name}</strong><b>{player.score}</b></div>)}</div><div className="end-actions"><button className="button button-primary button-large" onClick={onAgain}><RotateCcw size={18} /> Jogar novamente</button><button className="button button-secondary button-large" onClick={onNew}><Plus size={18} /> Nova noite</button></div></section>;
}

function Highlight({ icon, label, name, value }: { icon: React.ReactNode; label: string; name: string; value: string }) {
  return <div className="highlight-card"><span className="highlight-icon">{icon}</span><span className="eyebrow">{label}</span><strong>{name}</strong><small>{value}</small></div>;
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  return <div className="progress-track"><span style={{ width: `${Math.min(100, value / max * 100)}%`, background: color }} /></div>;
}

function TopBar({ title, onBack, right }: { title: string; onBack: () => void; right?: React.ReactNode }) {
  return <header className="top-bar"><button className="icon-button" onClick={onBack} aria-label="Voltar"><ArrowLeft size={19} /></button><span className="top-bar-title">{title}</span>{right ?? <span className="top-bar-spacer" />}</header>;
}

function ConfirmModal({ icon, eyebrow, title, text, secondary, primary, onSecondary, onPrimary, danger = false }: { icon: React.ReactNode; eyebrow: string; title: string; text: string; secondary: string; primary: string; onSecondary: () => void; onPrimary: () => void; danger?: boolean }) {
  return <div className="modal-backdrop" role="presentation"><div className="modal-sheet" role="dialog" aria-modal="true"><div className="modal-icon">{icon}</div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{text}</p><div className="modal-actions"><button className="button button-ghost button-large" onClick={onSecondary}>{secondary}</button><button className={`button ${danger ? 'button-danger' : 'button-primary'} button-large`} onClick={onPrimary}>{primary}</button></div></div></div>;
}

export default App;
