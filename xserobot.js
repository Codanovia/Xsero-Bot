/// Importowanie biblioteki discord.js
const Discord = require('discord.js');
/// Importowanie biblioteki odpowiedzialnej za pobranie filmu z YT dla bota
const ytdl = require('ytdl-core');
/// Wymaganie dostępu do pliku zarządzającego YouTube API
const youtube = require('./youtube.js');
/// Wymaganie dostępu do pliku config.json
const config = require('./config.json');
/// Uzyskuje dostęp do klasy zawartej w bibliotece
const bot = new Discord.Client();
/// Lista piosenek puszczanych przez bota
var ytAudioQueue = [];
var dispatcher = null;
/// Wymaganie dostępu do zarządzenia plikami JSON
var fs = require('fs');
/// Komendy bota
bot.on("message", msg => {

  // Lista wyzywających zdań o długich nogach Darwina. Będzie potrzebna w komendzie ?hejtnadlugienogi
  var dlugieNogi = new Array();
  dlugieNogi[0] = "Długie nogi Darwina są gówniane!";
  dlugieNogi[1] = "Długie nogi Darwina są cholernie głupie!";
  dlugieNogi[2] = "Długie nogi Darwina to chuje!";
  dlugieNogi[3] = "Długie nogi Darwina są pojebane!";
  dlugieNogi[4] = "Długie nogi Darwina to okrucieństwo!";
  dlugieNogi[5] = "Jak ja zobaczę te długie nogi to ja im normalnie zajebię...";
  dlugieNogi[6] = "Długie nogi Darwina to cipki!";
  dlugieNogi[7] = "Nikt nie chce patrzyć na te cholerne, długie nogi Darwina!";
  dlugieNogi[8] = "Długie nogi Darwina powinny już zginąć!";
  dlugieNogi[9] = "Długie nogi Darwina nie mają mózgów!";
  dlugieNogi[10] = "Długie nogi Darwina nie wiedzą, ile to jest 1 + 1!";
  dlugieNogi[11] = "Długie nogi Darwina nie wiedzą co to jest komputer i co to są gry!";
  dlugieNogi[12] = "Długie nogi Darwina to zboki!";
  dlugieNogi[13] = "Długie nogi Darwina są popierdolone!";
  dlugieNogi[14] = "Długie nogi Darwina są nienormalnymi oszustami!";
  dlugieNogi[15] = "Długie nogi Darwina to najgorsze rzeczy wszechczasów!";
  dlugieNogi[16] = "Nic nie może być tak popierdolone jak długie nogi Darwina!";
  dlugieNogi[17] = "Długie nogi Darwina są po prostu za długie!";
  dlugieNogi[18] = "Długie nogi Darwina emitują ostre, pomarańczowe światło!";
  dlugieNogi[19] = "Długie nogi Darwina to pedały!";
  dlugieNogi[20] = "Długie nogi Darwina nie umieją pisać na klawiaturze!";
  dlugieNogi[21] = "Długie nogi, długie nogi, długie nogi... od tego bolą mnie nie tylko nogi!";
  dlugieNogi[22] = "Długie nogi Darwina powinny wejść na youareanidiot.org!";
  dlugieNogi[23] = "Jak ja zobaczę długie nogi na tym czacie jeszcze raz to chyba jestem za PiS i TVP!";
  dlugieNogi[24] = "Długie nogi Darwina nie pasują do Darwina!";
  dlugieNogi[25] = "Długie nogi Darwina są dwie i są do dupy!";
  dlugieNogi[26] = "Długie nogi Darwina kochają się w chmurkach na niebie!"
  dlugieNogi[27] = "Długie nogi Darwina są za brzydkie!";
  dlugieNogi[28] = "Długie nogi Darwina to illuminati!";

    var messageParts = msg.content.split(' ');
    var command = messageParts[0].toLowerCase();
    var parameters = messageParts.splice(1, messageParts.length);

    if(!msg.content.startsWith(config.prefix)) return;

    if(msg.author.bot) return;

    // Komenda ?ping
    if(msg.content.startsWith(config.prefix + "ping")) {
        msg.channel.sendMessage("Pong!");
    }

    // Komenda ?myavatar
    if(msg.content.startsWith(config.prefix + "myavatar")) {
            msg.reply(`**Twój awatar**: ${msg.author.avatarURL}`);
    }

    // Komenda ?myuserinfo
    if(msg.content.startsWith(config.prefix + "myuserinfo")) {
        msg.reply(`**Informacje dotyczące Twojego konta**:

        **Data rejestracji w serwisie Discord**: ${msg.author.createdAt}
        **Status obecności**: ${msg.author.presence.status}
        **ID konta**: ${msg.author.id}
        **Awatar konta**: ${msg.author.avatarURL}`);
    }

    // Komenda ?serverinfo
    if(msg.content.startsWith(config.prefix + "serverinfo")) {
        msg.reply(`**Informacje dotyczące danego serwera**:

        **Data założenia serwera**: ${msg.guild.createdAt}
        **Właściciel serwera**: ${msg.guild.owner}
        **Region serwera**: ${msg.guild.region}
        **Liczba użytkowników**: ${msg.guild.memberCount}
        **Domyślny kanał**: ${msg.guild.defaultChannel}
        **Poziom weryfikacyjny**: ${msg.guild.verificationLevel}
        **Limit czasu AFK**: ${msg.guild.afkTimeout} sekund
        **ID serwera**: ${msg.guild.id}
        **Ikona serwera**: ${msg.guild.iconURL}`);
    }

    // Komenda ?e
    if(msg.content.startsWith(config.prefix + "e")) {
        let e = msg.content.split(" ").slice(1);
        msg.channel.sendMessage(e[0] + " zrobił to :unamused: :gun:");
    }

    // Komenda ?stopspam
    if(msg.content.startsWith(config.prefix + "stopspam")) {
        msg.channel.sendMessage("**PROSZĘ NIE SPAMOWAĆ!**");
    }

    // Komenda ?prefix
    if(msg.content.startsWith(config.prefix + "prefix")) {
        if(msg.author.id !== config.ownerID) return msg.channel.sendMessage("Nie masz uprawnień do używania tej komendy!");
        let args = msg.content.split(" ").slice(1);
        config.prefix = args[0];
        fs.writeFile('./config.json', JSON.stringify(config), (err) => {if(err) console.error(err)})
}

    // Komenda ?shutdown
    if(msg.content.startsWith(config.prefix + "shutdown")) {
        if(msg.author.id !== config.ownerID) return msg.channel.sendMessage("nie masz uprawnień do używania tej komendy!");
        msg.channel.sendMessage("`Bot został wyłączony. Na razie, wszyscy!`");
        bot.destroy();
    }

    // Komenda ?siema
    if(msg.content.startsWith(config.prefix + "siema")) {
        msg.reply("No, siema.");
    }

    // Komenda ?joinchannel
    if(msg.content.startsWith(config.prefix + "joinchannel")) {
        msg.reply("próbuję dołączyć do kanału " + parameters[0]);
        JoinCommand(parameters[0]);
    }

    // Komenda ?play
    if(msg.content.startsWith(config.prefix + "play")) {
        PlayCommand(parameters.join(" "), message);
    }

    // Komenda ?queue
    if(msg.content.startsWith(config.prefix + "queue")) {
        PlayQueueCommand(message);
    }

    // Komenda ?about
    if(msg.content.startsWith(config.prefix + "about")) {
      msg.channel.sendMessage(`Bot Discord'a, który został napisany w JavaScript (node.js) używając biblioteki discord.js.
      Wersja bota: 1.1
      Repozytorium bota: https://github.com/Xsero/Xsero-Bot`)
    }

    // Komenda ?hejtnadlugienogi
    if(msg.content.startsWith(config.prefix + "hejtnadlugienogi")) {
        msg.channel.sendMessage(dlugieNogi[Math.floor(Math.random()*dlugieNogi.length)]);
    }

    // Komenda ?help
    if(msg.content.startsWith(config.prefix + "help")) {
        msg.channel.sendMessage(`W chwili obecnej dostępnych jest 13 komend dla wszystkich i 3 komendy wyłącznie dla właściciela bota:

        Komendy dostępne dla wszystkich:
        **?ping**
        **?myavatar**
        **?myuserinfo**
        **?serverinfo**
        **?e**
        **?stopspam**
        **?siema**
        **?joinchannel**
        **?play**
        **?queue**
        **?hejtnadlugienogi**
        **?help**
        **?about**

        Komendy dostępne wyłącznie dla właściciela bota:
        **?prefix**
        **?shutdown**

        Możecie wymyślić propozycje swoich komend. :wink:
        Ponadto należy zwrócić uwagę na to, że bot nie jest jeszcze dopracowany!
        Żeby uzyskać informacje na temat tych komend wpisz ?help (dowolna komenda).`);
    }
    // Informacje o poszczególnych komendach
    if(msg.content.startsWith(config.prefix + "help ping")) {
        msg.channel.sendMessage("Testowa komenda. Sprawdza, czy bot będzie odpisywał.");
    }
    else if(msg.content.startsWith(config.prefix + "help avatar")) {
        msg.channel.sendMessage("Przesyła link do Twojego awatara");
    }
    else if(msg.content.startsWith(config.prefix + "help info")) {
        msg.channel.sendMessage("Udziela informacji o Twoim koncie");
    }
    else if(msg.content.startsWith(config.prefix + "help serverinfo")) {
        msg.channel.sendMessage("Udziela informacji o serwerze, na którym napisano tę komendę");
    }
    else if(msg.content.startsWith(config.prefix + "help e")) {
        msg.channel.sendMessage("Wiadomo, do czego prowadzi ta komenda. :laughing:");
    }
    else if(msg.content.startsWith(config.prefix + "help stopspam")) {
        msg.channel.sendMessage("Próbuje powstrzymać rozszerzający się spam");
    }
    else if(msg.content.startsWith(config.prefix + "help siema")) {
        msg.channel.sendMessage(`Odpisuje "siema" do Ciebie.`);
    }
    else if(msg.content.startsWith(config.prefix + "help joinchannel")) {
        msg.channel.sendMessage("Dołącza bota do kanału głosowego");
    }
    else if(msg.content.startsWith(config.prefix + "help play")) {
        msg.channel.sendMessage("Dodaje ścieżkę audio do kolejki, która będzie grana, kiedy będzie jej kolej");
    }
    else if(msg.content.startsWith(config.prefix + "help queue")) {
        msg.channel.sendMessage("Pokazuje kolejkę ścieżek audio");
    }
    else if(msg.content.startsWith(config.prefix + "help about")) {
        msg.channel.sendMessage("Wyświetla informacje o bocie.");
    }
    else if(msg.content.startsWith(config.prefix + "help hejtnadlugienogi")) {
        msg.channel.sendMessage("Dla hejtujących długie nogi Darwina - ta komenda pokazuje jedno z losowych wyzywających zdań o tych nogach");
    }
    else if(msg.content.startsWith(config.prefix + "help prefix")) {
        msg.channel.sendMessage("**(KOMENDA DOSTĘNA WYŁĄCZNIE DLA WŁAŚCICIELA BOTA!)** Zmienia prefiks komend");
    }
    else if(msg.content.startsWith(config.prefix + "help shutdown")) {
        msg.channel.sendMessage("**(KOMENDA DOSTĘPNA WYŁĄCZNIE DLA WŁAŚCICIELA BOTA!)** Wyłącza bota");
    }
});

/// Włącza ścieżkę audio na podstawie wyników wyszukiwania frazu
function PlayCommand(searchTerm) {
    // jeżeli bot nie jest na żadnym kanale głosowym, dołącz do ogólnego
    if(bot.voiceConnections.array().length === 0) {
        if (bot.voiceConnections.array().length == 0) {
        var defaultVoiceChannel = bot.channels.find(val => val.type === 'voice').name;
        JoinCommand(defaultVoiceChannel);
        }
    // szukaj filmów używając podanego frazu i przywołaj z powrotem, jeśli znaleziono
    youtube.search(searchTerm, QueueYtAudioStream);
    }
}

/// Kolejka ścieżek audio
function PlayQueueCommand(message) {
    var queueString = "";

    for(var x = 0; x < ytAudioQueue.length; x++) {
        queueString += ytAudioQueue[x].videoName + ", ";
    }

    queueString = queueString.substring(0, queueString.length - 2);
    message.reply(queueString);
}

/// Dołącza bota do określonego kanału
function JoinCommand(channelName) {
    var voiceChannel = GetChannelByName(channelName);

    if (voiceChannel) {
        voiceChannel.join();
        console.log("Dołączono do kanału " + voiceChannel.name);
    }

    return voiceChannel;
}

/// Zwraca kanał, który pasuje do jego podanej nazwy
function GetChannelByName(name) {
    var channel = bot.channels.find(val => val.name === name);
    return channel;
}

/// Dodaje wynik wyszukiwania YouTube'a do kolejki na strumień
function QueueYtAudioStream(videoId, videoName) {
    var streamUrl = `${youtube.watchVideoUrl}${videoId}`;

    if (!ytAudioQueue.length) {
        ytAudioQueue.push(
            {
                'streamUrl': streamUrl,
                'videoName': videoName
            }
        );

        console.log("Dodano ścieżkę audio do kolejki: " + videoName);
        PlayStream(ytAudioQueue[0].streamUrl);
    }
    else {
        ytAudioQueue.push(
            {
                'streamUrl': streamUrl,
                'videoName': videoName
            }
        );

        console.log("Dodano ścieżkę audio do kolejki: " + videoName);
    }

}

/// Gra dany strumień
function PlayStream(streamUrl) {

    const streamOptions = {seek: 0, volume: 1};

    if (streamUrl) {
        const stream = ytdl(streamUrl, {filter: 'audioonly'});

        if (dispatcher == null) {

            var voiceConnection = bot.voiceConnections.first();
            //console.log(voiceConnection);

            if (voiceConnection) {

                console.log("Teraz gramy: " + ytAudioQueue[0].videoName);
                dispatcher = bot.voiceConnections.first().playStream(stream, streamOptions);

                dispatcher.on('end', () => {
                    PlayNextStreamInQueue();
                });

                dispatcher.on('error', (err) => {
                    console.log(err);
                });
            }
        }
        else {
            dispatcher = bot.voiceConnections.first().playStream(stream, streamOptions);
        }
    }
}

/// Gra następny strumień w kolejce
function PlayNextStreamInQueue() {

    ytAudioQueue.splice(0, 1);

    // if there are streams remaining in the queue then try to play
    if (ytAudioQueue.length != 0) {
        console.log("Teraz gramy: " + ytAudioQueue[0].videoName);
        PlayStream(ytAudioQueue[0].streamUrl);
    }
}

// Informacja o nowym użytkowniku na serwerze
bot.on("guildMemberAdd", (member) => {
console.log(`Użytkownik ${member.user.username} dołączył do serwera ${member.guild.name}`);
member.guild.defaultChannel.sendMessage(`**${member.user.username}** dołączył do nas! Witaj, **${member.user.username}**!`);
});

/// Informacja o opuszczeniu/wyrzuceniu użytkownika z serwera
bot.on("guildMemberRemove", (member) => {
console.log(`Użytkownik ${member.user.username} opuścił serwer ${member.guild.name}`);
member.guild.defaultChannel.sendMessage(`**${member.user.username}** opuścił nas. :frowning:`);
});

/// Ta funkcja zostaje włączona, gdy bot będzie online
bot.on('ready', () => {
console.log(`Gotowy do aktywności w ${bot.channels.size} kanałach na ${bot.guilds.size} serwerach, łącznie obsługuję ${bot.users.size} użytkowników`);
bot.user.setGame("Praca w toku");
});

/// Te funkcje informują konsolę o błędach, ostrzeżeniach i debugowaniach
bot.on('error', e => { console.error(e); });
bot.on('warn', e => { console.warn(e); });
bot.on('debug', e => { console.info(e); });

/// Loguje bota używając specjalnego klucza
bot.login(config.token);
