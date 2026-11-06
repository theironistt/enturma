import type { Challenge, ChallengeCategory, Difficulty, GameMode } from '../types/game';

const socialModes: GameMode[] = ['social', 'ousado', 'capetinha-roxo'];
const boldModes: GameMode[] = ['ousado', 'capetinha-roxo'];
const purpleMode: GameMode[] = ['capetinha-roxo'];
const points: Record<Difficulty, number> = { facil: 10, media: 20, ousada: 30, epica: 50 };

function challenge(
  id: string,
  title: string,
  description: string,
  category: ChallengeCategory,
  difficulty: Difficulty,
  modes: GameMode[],
  extraCardEligible = false
): Challenge {
  return { id, title, description, category, difficulty, points: points[difficulty], modes, extraCardEligible, active: true };
}

export const challenges: Challenge[] = [
  // Quebra-gelo
  challenge('c-001', 'Nome e sorriso', 'Apresente-se para alguém que você ainda não conhece e descubra o nome da pessoa.', 'quebra-gelo', 'facil', socialModes),
  challenge('c-002', 'A pergunta inusitada', 'Faça uma pergunta leve e inusitada para uma pessoa nova e escute a resposta inteira.', 'quebra-gelo', 'facil', socialModes),
  challenge('c-003', 'Duas verdades', 'Conte duas coisas verdadeiras sobre você para alguém que acabou de conhecer.', 'quebra-gelo', 'facil', socialModes),
  challenge('c-004', 'Clima da noite', 'Pergunte a alguém novo o que trouxe essa pessoa para o evento de hoje.', 'quebra-gelo', 'facil', socialModes),
  challenge('c-005', 'Elogio específico', 'Faça um elogio sincero e específico sobre um detalhe de estilo de alguém, sem invadir o espaço da pessoa.', 'quebra-gelo', 'media', socialModes),
  challenge('c-006', 'Conexão improvável', 'Encontre alguém que compartilhe um gosto seu e descubra qual é a coincidência.', 'quebra-gelo', 'media', socialModes),
  challenge('c-007', 'Apresentação cruzada', 'Apresente duas pessoas que ainda não se conhecem usando uma informação positiva que você descobriu.', 'quebra-gelo', 'media', socialModes),
  challenge('c-008', 'História de cinco minutos', 'Inicie uma conversa com alguém novo e descubra uma história marcante dos últimos meses.', 'quebra-gelo', 'media', socialModes),
  challenge('c-009', 'Pergunta para a roda', 'Pergunte a três pessoas novas qual foi a melhor parte da noite até agora.', 'quebra-gelo', 'ousada', socialModes),
  challenge('c-010', 'Guia por um minuto', 'Peça a alguém novo para mostrar seu lugar favorito no evento e agradeça a indicação.', 'quebra-gelo', 'ousada', socialModes),
  challenge('c-011', 'A conversa que fica', 'Tenha uma conversa de pelo menos dez minutos com alguém novo sobre um assunto que interesse aos dois.', 'quebra-gelo', 'ousada', socialModes, true),

  // Investigação social
  challenge('c-012', 'Descubra a trilha', 'Descubra de alguém novo qual música não pode faltar na noite.', 'investigação social', 'facil', socialModes),
  challenge('c-013', 'O rolê ideal', 'Pergunte a uma pessoa nova qual seria o rolê perfeito para um sábado.', 'investigação social', 'facil', socialModes),
  challenge('c-014', 'Talento secreto', 'Descubra um talento ou hobby inesperado de alguém que você acabou de conhecer.', 'investigação social', 'facil', socialModes),
  challenge('c-015', 'Origem do look', 'Pergunte a alguém novo qual peça do visual tem uma história especial.', 'investigação social', 'facil', socialModes),
  challenge('c-016', 'Plano B', 'Descubra de uma pessoa nova qual foi o melhor plano B que ela já inventou.', 'investigação social', 'media', socialModes),
  challenge('c-017', 'Três recomendações', 'Peça a alguém novo uma indicação de filme, série ou livro e anote mentalmente o motivo.', 'investigação social', 'media', socialModes),
  challenge('c-018', 'Pequena vitória', 'Pergunte a alguém novo qual pequena coisa deixou a semana dessa pessoa melhor.', 'investigação social', 'media', socialModes),
  challenge('c-019', 'Mapa afetivo', 'Descubra de alguém novo um lugar da cidade que essa pessoa gosta de revisitar.', 'investigação social', 'media', socialModes),
  challenge('c-020', 'A opinião corajosa', 'Peça uma opinião divertida e respeitosa sobre uma tendência popular para alguém novo.', 'investigação social', 'ousada', socialModes),
  challenge('c-021', 'Repórter da noite', 'Colete de três pessoas novas uma palavra para descrever a noite e compare as respostas.', 'investigação social', 'ousada', socialModes),
  challenge('c-022', 'A pergunta profunda', 'Converse com alguém novo sobre um sonho que a pessoa gostaria de realizar, se ela quiser compartilhar.', 'investigação social', 'ousada', socialModes, true),
  challenge('c-112', 'A dos signos', 'Descobrir o nome, signo e insta de uma mulher que ninguém da sua mesa conhece e voltar para contar ao grupo.', 'investigação social', 'ousada', socialModes, true),

  // Bar e bebidas
  challenge('c-023', 'Brinde de chegada', 'Faça um brinde com uma pessoa nova, usando água ou a bebida que cada um preferir.', 'bar e bebidas', 'facil', socialModes),
  challenge('c-024', 'Recomendação do balcão', 'Peça a alguém novo uma recomendação de bebida sem álcool ou drink que essa pessoa gosta.', 'bar e bebidas', 'facil', socialModes),
  challenge('c-025', 'Gole de gentileza', 'Ofereça uma bebida a alguém novo, deixando a pessoa totalmente à vontade para aceitar ou recusar.', 'bar e bebidas', 'media', socialModes),
  challenge('c-026', 'O brinde temático', 'Crie um brinde curto sobre a noite e compartilhe com uma pessoa que você acabou de conhecer.', 'bar e bebidas', 'media', socialModes),
  challenge('c-027', 'Duelo de sabores', 'Descubra duas bebidas favoritas de alguém novo e diga qual delas você provaria.', 'bar e bebidas', 'media', socialModes),
  challenge('c-028', 'Pedido compartilhado', 'Peça uma sugestão de petisco a alguém novo e agradeça pela dica.', 'bar e bebidas', 'facil', socialModes),
  challenge('c-029', 'Água na pista', 'Convide uma pessoa nova para pegar água com você antes de voltar para a festa.', 'bar e bebidas', 'ousada', socialModes),
  challenge('c-030', 'Mixologista curioso', 'Pergunte a alguém novo qual ingrediente diferente essa pessoa colocaria em um drink.', 'bar e bebidas', 'media', socialModes),
  challenge('c-031', 'Brinde coletivo', 'Monte um brinde com três pessoas que não estavam juntas antes, respeitando a bebida de cada uma.', 'bar e bebidas', 'ousada', socialModes),
  challenge('c-032', 'Mesa convidativa', 'Convide alguém novo para se juntar ao seu grupo por alguns minutos, sem pressão e com espaço para recusa.', 'bar e bebidas', 'ousada', socialModes, true),
  challenge('c-033', 'A escolha da noite', 'Descubra a bebida favorita de duas pessoas novas e faça um brinde celebrando escolhas diferentes.', 'bar e bebidas', 'ousada', socialModes),

  // Foto e vídeo
  challenge('c-034', 'Retrato autorizado', 'Peça autorização e tire uma foto espontânea com alguém que você acabou de conhecer.', 'foto e vídeo', 'media', socialModes),
  challenge('c-035', 'Pose de capa', 'Convide uma pessoa nova para fazer uma pose de capa de revista com você, somente se ela quiser.', 'foto e vídeo', 'media', socialModes),
  challenge('c-036', 'Foto do detalhe', 'Peça para alguém novo fotografar um detalhe divertido do seu look e agradeça.', 'foto e vídeo', 'facil', socialModes),
  challenge('c-037', 'Selfie da galera', 'Faça uma selfie com alguém novo e mais uma pessoa do seu grupo, com autorização de todos.', 'foto e vídeo', 'media', socialModes),
  challenge('c-038', 'Vídeo de recomendação', 'Peça autorização para gravar uma recomendação de música de até dez segundos.', 'foto e vídeo', 'ousada', boldModes),
  challenge('c-039', 'Moldura da noite', 'Encontre uma pessoa nova e criem juntos uma moldura imaginária para uma foto autorizada.', 'foto e vídeo', 'media', socialModes),
  challenge('c-040', 'Foto sem pose', 'Pergunte a alguém novo se aceita uma foto sorrindo sem pose e registre apenas com consentimento.', 'foto e vídeo', 'ousada', boldModes),
  challenge('c-041', 'Bastidores gentis', 'Grave um vídeo curto com uma pessoa nova dizendo uma palavra que representa a noite, se ela aceitar.', 'foto e vídeo', 'ousada', boldModes),
  challenge('c-042', 'Duas câmeras', 'Troque uma foto autorizada com alguém novo: cada pessoa registra a outra em um ângulo divertido.', 'foto e vídeo', 'ousada', boldModes),
  challenge('c-043', 'Memória em grupo', 'Organize uma foto autorizada com quatro pessoas que ainda não tinham posado juntas.', 'foto e vídeo', 'ousada', boldModes, true),
  challenge('c-044', 'Cena final', 'Crie com alguém novo uma foto autorizada que pareça o pôster de uma noite inesquecível.', 'foto e vídeo', 'epica', purpleMode, true),

  // Redes sociais
  challenge('c-045', 'Perfil recomendado', 'Pergunte a alguém novo qual perfil, página ou canal essa pessoa acha divertido acompanhar.', 'redes sociais', 'facil', socialModes),
  challenge('c-046', 'Troca de playlist', 'Peça uma recomendação de playlist e compartilhe uma sua, sem precisar trocar contatos.', 'redes sociais', 'facil', socialModes),
  challenge('c-047', 'Segue se quiser', 'Se houver interesse mútuo, pergunte se a pessoa gostaria de trocar perfil social.', 'redes sociais', 'media', boldModes),
  challenge('c-048', 'Story autorizado', 'Convide alguém novo para aparecer em um story e publique somente se todos autorizarem.', 'redes sociais', 'ousada', boldModes),
  challenge('c-049', 'Emoji da noite', 'Descubra qual emoji uma pessoa nova usaria para descrever o evento e compartilhe a resposta com o grupo.', 'redes sociais', 'facil', socialModes),
  challenge('c-050', 'Conta em comum', 'Descubra com alguém novo uma página ou criador que os dois acompanham.', 'redes sociais', 'media', socialModes),
  challenge('c-051', 'Hashtag inventada', 'Crie com alguém novo uma hashtag divertida para a noite, sem publicar nada sem autorização.', 'redes sociais', 'media', socialModes),
  challenge('c-052', 'Meme da pista', 'Pergunte a alguém novo qual meme representa o humor da noite e mostre um que você gosta.', 'redes sociais', 'media', socialModes),
  challenge('c-053', 'Dancinha consentida', 'Grave uma dança curta com alguém novo apenas se a pessoa quiser e sem postar sem autorização.', 'redes sociais', 'ousada', boldModes),
  challenge('c-054', 'Mensagem de boas-vindas', 'Troque uma mensagem simpática com alguém novo que você conheceu hoje, se ambos quiserem.', 'redes sociais', 'ousada', boldModes),
  challenge('c-055', 'Registro oficial', 'Publique uma foto autorizada da noite marcando uma pessoa nova somente após confirmar que ela quer ser marcada.', 'redes sociais', 'epica', purpleMode, true),

  // Flerte
  challenge('c-056', 'Olhar e sorriso', 'Troque um olhar e um sorriso com alguém por quem você sentiu interesse, respeitando qualquer sinal de distância.', 'flerte', 'media', boldModes),
  challenge('c-057', 'Elogio com intenção', 'Faça um elogio sincero e direto a alguém por quem você se interessou, deixando espaço para a pessoa responder.', 'flerte', 'media', boldModes),
  challenge('c-058', 'Pergunta de química', 'Pergunte a alguém novo o que faz uma boa conversa ficar interessante para essa pessoa.', 'flerte', 'media', boldModes),
  challenge('c-059', 'Convite leve', 'Convide alguém para conversar em um lugar mais tranquilo do evento, se houver interesse mútuo.', 'flerte', 'ousada', boldModes),
  challenge('c-060', 'Contato com respeito', 'Se a conversa fluir, pergunte se a pessoa gostaria de trocar número ou perfil social.', 'flerte', 'ousada', boldModes),
  challenge('c-061', 'A cantada elegante', 'Crie e diga uma cantada divertida que não seja invasiva, aceitando qualquer reação com leveza.', 'flerte', 'ousada', boldModes),
  challenge('c-062', 'Química em três palavras', 'Descreva a vibe de alguém novo em três palavras e pergunte se a pessoa concorda.', 'flerte', 'media', boldModes),
  challenge('c-063', 'Convite para a próxima', 'Se houver interesse mútuo, convide a pessoa para conhecer outro rolê no futuro.', 'flerte', 'ousada', boldModes),
  challenge('c-064', 'Pista de interesse', 'Pergunte diretamente, com gentileza, se a pessoa está curtindo conversar com você.', 'flerte', 'ousada', boldModes),
  challenge('c-065', 'Flerte cinematográfico', 'Faça um elogio digno de filme para alguém que você acabou de conhecer, sem insistir se não houver retorno.', 'flerte', 'ousada', boldModes, true),
  challenge('c-066', 'O sim tranquilo', 'Consiga um “sim” claro para continuar a conversa e comemore respeitando a decisão da outra pessoa.', 'flerte', 'epica', purpleMode, true),

  // Romance
  challenge('c-067', 'Convite para dançar', 'Convide alguém novo para dançar; um não é uma resposta completa e deve ser recebido com respeito.', 'romance', 'ousada', boldModes),
  challenge('c-068', 'Dança lenta', 'Dance uma música lenta com alguém que aceite o convite e mantenha o espaço confortável para os dois.', 'romance', 'ousada', boldModes),
  challenge('c-069', 'Número do futuro', 'Se houver conexão, pergunte se a pessoa gostaria de trocar contato para conversar outro dia.', 'romance', 'ousada', boldModes),
  challenge('c-070', 'Encontro possível', 'Convide alguém novo para um café ou passeio futuro, somente se o interesse parecer recíproco.', 'romance', 'ousada', boldModes),
  challenge('c-071', 'Elogio que fica', 'Diga a alguém novo uma qualidade que você percebeu durante a conversa.', 'romance', 'media', boldModes),
  challenge('c-072', 'Playlist a dois', 'Monte com alguém novo uma mini playlist de três músicas que combinam com a conversa.', 'romance', 'media', boldModes),
  challenge('c-073', 'Foto de dupla', 'Peça autorização para registrar uma foto bonita com alguém por quem você se interessou.', 'romance', 'ousada', boldModes),
  challenge('c-074', 'Brinde à química', 'Faça um brinde com alguém novo à química da conversa, com a bebida que cada um quiser.', 'romance', 'media', boldModes),
  challenge('c-075', 'Pergunta romântica', 'Pergunte a alguém novo qual seria um encontro perfeito para essa pessoa.', 'romance', 'media', boldModes),
  challenge('c-076', 'Beijo perguntado', 'Pergunte claramente se a pessoa gostaria de beijar você e aceite a resposta sem insistir.', 'romance', 'epica', purpleMode, true),
  challenge('c-077', 'Final de comédia romântica', 'Se houver interesse mútuo, combine um próximo encontro e troque um contato escolhido pelos dois.', 'romance', 'epica', purpleMode, true),

  // Dança e performance
  challenge('c-078', 'Passo emprestado', 'Aprenda um passo de dança com alguém novo e repita junto por alguns segundos.', 'dança e performance', 'media', boldModes),
  challenge('c-079', 'Dança de apresentação', 'Convide alguém novo para uma dança curta de apresentação, sem tocar sem combinar.', 'dança e performance', 'media', boldModes),
  challenge('c-080', 'Coreografia de oito tempos', 'Crie oito tempos de uma coreografia com uma pessoa que você acabou de conhecer.', 'dança e performance', 'ousada', boldModes),
  challenge('c-081', 'Palco imaginário', 'Faça uma performance de quinze segundos para alguém novo que aceite assistir.', 'dança e performance', 'ousada', boldModes),
  challenge('c-082', 'Dupla improvável', 'Encontre alguém com um estilo bem diferente do seu e dancem uma música juntos, se a pessoa quiser.', 'dança e performance', 'ousada', boldModes),
  challenge('c-083', 'Professor por um minuto', 'Ensine um passo simples para alguém novo e aprenda outro em troca.', 'dança e performance', 'media', boldModes),
  challenge('c-084', 'Batalha gentil', 'Faça uma batalha de dança divertida com alguém que topar, terminando com aplausos para os dois.', 'dança e performance', 'ousada', boldModes),
  challenge('c-085', 'Performance em trio', 'Monte uma performance curta com duas pessoas que você ainda não conhecia.', 'dança e performance', 'ousada', boldModes),
  challenge('c-086', 'Pista cheia', 'Convide três pessoas novas para dançar por uma música, sempre respeitando quem preferir não participar.', 'dança e performance', 'epica', purpleMode, true),
  challenge('c-087', 'Final coreografado', 'Crie uma coreografia curta com alguém novo e apresente para o seu grupo, com autorização.', 'dança e performance', 'epica', purpleMode, true),
  challenge('c-088', 'DJ por um minuto', 'Pergunte a alguém novo qual música escolheria para animar a pista e faça a sugestão circular.', 'dança e performance', 'media', socialModes),

  // Bilhetes e mensagens
  challenge('c-089', 'Bilhete simpático', 'Escreva um elogio curto e entregue um bilhete a alguém novo, permitindo que a pessoa descarte se preferir.', 'bilhetes e mensagens', 'media', boldModes),
  challenge('c-090', 'Mensagem misteriosa', 'Deixe uma mensagem positiva para alguém que você acabou de conhecer, assinada com seu nome.', 'bilhetes e mensagens', 'facil', socialModes),
  challenge('c-091', 'Pedido de música', 'Escreva um pedido de música e entregue a alguém novo para descobrir se a escolha combina com a noite.', 'bilhetes e mensagens', 'media', socialModes),
  challenge('c-092', 'Cartão de recomendação', 'Troque com alguém novo uma recomendação escrita de lugar para comer, ouvir música ou passear.', 'bilhetes e mensagens', 'facil', socialModes),
  challenge('c-093', 'Frase de impacto', 'Crie com alguém novo uma frase curta que poderia ser o slogan da noite.', 'bilhetes e mensagens', 'media', socialModes),
  challenge('c-094', 'Convite no papel', 'Escreva um convite para um café ou passeio pela festa (kk) e entregue somente se houver interesse mútuo.', 'bilhetes e mensagens', 'ousada', boldModes),
  challenge('c-095', 'Correio elegante', 'Entregue um bilhete romântico para alguém', 'bilhetes e mensagens', 'ousada', boldModes),
  challenge('c-096', 'Mensagem em três emojis', 'Converse com alguém novo usando três emojis escolhidos por vocês e descubra a história por trás deles.', 'bilhetes e mensagens', 'facil', socialModes),
  challenge('c-097', 'Recado para amanhã', 'Escreva com alguém novo uma mensagem para vocês lerem amanhã e troquem os contatos apenas se quiserem.', 'bilhetes e mensagens', 'ousada', boldModes),
  challenge('c-098', 'Carta de uma linha', 'Escreva uma linha sobre o melhor momento da noite e compartilhe com uma pessoa nova.', 'bilhetes e mensagens', 'media', socialModes),
  challenge('c-099', 'Bilhete épico', 'Entregue um bilhete criativo para alguém novo e descubra se a pessoa quer continuar a conversa.', 'bilhetes e mensagens', 'epica', purpleMode, true),

  // Missões épicas
  challenge('c-100', 'Ponte entre grupos', 'Apresente duas pessoas do seu grupo a duas pessoas novas e crie uma conversa conjunta.', 'missões épicas', 'ousada', purpleMode, true),
  challenge('c-101', 'A roda improvável', 'Monte uma roda com cinco pessoas que não estavam juntas e proponha uma pergunta para todas responderem.', 'missões épicas', 'epica', purpleMode, true),
  challenge('c-102', 'Trilha sonora humana', 'Descubra uma música favorita de quatro pessoas novas e encontre um ponto em comum entre as escolhas.', 'missões épicas', 'epica', purpleMode, true),
  challenge('c-103', 'Foto de desconhecidos', 'Com autorização de todos, organize uma foto com cinco pessoas que não se conheciam no início da noite.', 'missões épicas', 'epica', purpleMode, true),
  challenge('c-104', 'Convite coletivo', 'Convide três pessoas novas para uma dança ou conversa em grupo, deixando a recusa sempre confortável.', 'missões épicas', 'epica', purpleMode, true),
  challenge('c-105', 'A recomendação cruzada', 'Peça a três pessoas novas recomendações diferentes e conecte as três em uma conversa.', 'missões épicas', 'ousada', purpleMode, true),
  challenge('c-106', 'Mural de elogios', 'Colete três elogios sinceros de pessoas novas e compartilhe um elogio com cada uma delas.', 'missões épicas', 'ousada', purpleMode, true),
  challenge('c-107', 'HORA DO BEIJO', 'BEIJE alguém na festa, qualquer um menos amigos', 'missões épicas', 'epica', purpleMode, true),
  challenge('c-108', 'Conexão real', 'Tenha uma conversa de quinze minutos com alguém novo e descubra uma experiência que os dois gostariam de viver.', 'missões épicas', 'epica', purpleMode, true),
  challenge('c-109', 'A noite em uma foto', 'Crie uma foto autorizada que represente a noite reunindo pessoas de grupos diferentes.', 'missões épicas', 'epica', purpleMode, true),
  challenge('c-110', 'Final roxo', 'Se houver interesse mútuo, convide alguém novo para uma dança, troque um contato e combine um próximo rolê.', 'missões épicas', 'epica', purpleMode, true),
  challenge('c-113', 'Olhadinhas', 'Encontre alguém que você se interessou, espere seus olhares se cruzarem, e fixe o olhar nessa pessoa por pelo menos 8 segundos', 'missões épicas', 'epica', purpleMode, true)
];

export const challengeCount = challenges.length;
