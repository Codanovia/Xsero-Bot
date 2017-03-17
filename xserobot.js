/* IMPORTOWANIE BIBLIOTEK I ZARZĄDZENIE MUZYKĄ ORAZ PLIKAMI BOTA */
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
/// Kolejka piosenek puszczanych przez bota
var ytAudioQueue = [];
/// Zmienna zarządzająca puszczeniem piosenek na kanale głosowym
var dispatcher = null;
/// Wymaganie dostępu do zarządzenia plikami JSON
const fs = require('fs');
/* KOMENDY BOTA */
bot.on("message", msg => {
  /// Lista wyzywających zdań o długich nogach Darwina. Będzie potrzebna w komendzie ?hejtnadlugienogi
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

  /// Lista możliwych odpowiedzi na komendę ?8ball
  var eightBall = new Array();
  eightBall[0] = "Na 100% **NIE!**";
  eightBall[1] = "Na pewno nie";
  eightBall[2] = "Zdecydowanie nie";
  eightBall[3] = "Chyba nie";
  eightBall[4] = "Możliwe, że nie";
  eightBall[5] = "Myślę, że nie";
  eightBall[6] = "Moje źródła mówią, że nie"
  eightBall[7] = "Nie";
  eightBall[8] = "Nie wiem";
  eightBall[9] = "Nie jestem pewny";
  eightBall[10] = "Nie mam zdania";
  eightBall[11] = "Tak";
  eightBall[12] = "Moje źródła mówią, że tak";
  eightBall[13] = "Myślę, że tak";
  eightBall[14] = "Możliwe, że tak";
  eightBall[15] = "Chyba tak";
  eightBall[16] = "Zdecydowanie tak";
  eightBall[17] = "Na pewno tak";
  eightBall[18] = "Na 100% **TAK!**";

    /// Dzielenie wiadomości na części
    var messageParts = msg.content.split(' ');
    /// Splatanie wiadomości
    var parameters = messageParts.splice(1, messageParts.length);

    /// Jeżeli komenda nie zaczyna się od prefiksu, nic nie zwracaj
    if(!msg.content.startsWith(config.prefix)) return;

    /// Jeżeli użytkownik nadający komendę jest Xsero Botem, nic nie zwracaj
    if(msg.author.bot) return;

    /// Komenda ?ping
    if(msg.content.startsWith(config.prefix + "ping")) {
        msg.channel.sendMessage("Pong!");
    }

    /// Komenda ?myavatar
    if(msg.content.startsWith(config.prefix + "myavatar")) {
        msg.reply(`**twój awatar**: ${msg.author.avatarURL}`);
    }

    /// Komenda ?myuserinfo
    if(msg.content.startsWith(config.prefix + "myuserinfo")) {
        msg.channel.sendMessage(`${msg.author} **Informacje dotyczące Twojego konta**:
        Data rejestracji w serwisie Discord: **${msg.author.createdAt}**
        Status obecności: **${msg.author.presence.status}**
        ID konta: **${msg.author.id}**
        Awatar konta: ${msg.author.avatarURL}`);
    }

    /// Komenda ?serverinfo
    if(msg.content.startsWith(config.prefix + "serverinfo")) {
        msg.channel.sendMessage(`${msg.author} **Informacje dotyczące danego serwera**:
        Data założenia serwera: **${msg.guild.createdAt}**
        Właściciel serwera: **${msg.guild.owner}**
        Region serwera: **${msg.guild.region}**
        Liczba użytkowników: **${msg.guild.memberCount}**
        Domyślny kanał: **${msg.guild.defaultChannel}**
        Poziom weryfikacyjny: **${msg.guild.verificationLevel}**
        Limit czasu AFK: **${msg.guild.afkTimeout}** sekund
        ID serwera: **${msg.guild.id}**
        Ikona serwera: ${msg.guild.iconURL}`);
    }

    /// Komenda ?stopspam
    if(msg.content.startsWith(config.prefix + "stopspam")) {
        msg.channel.sendMessage("**PROSZĘ NIE SPAMOWAĆ!**");
    }

    /// Komenda ?prefix
    if(msg.content.startsWith(config.prefix + "prefix")) {
        if(msg.author.id !== config.ownerID) return msg.channel.sendMessage("Nie masz uprawnień do używania tej komendy!");
        config.prefix = parameters[0];
        fs.writeFile('./config.json', JSON.stringify(config), (err) => {if(err) console.error(err)})
        bot.user.setGame(config.prefix + "help");
}

    /// Komenda ?shutdown
    if(msg.content.startsWith(config.prefix + "shutdown")) {
        if(msg.author.id !== config.ownerID) return msg.channel.sendMessage("Nie masz uprawnień do używania tej komendy!");
        msg.channel.sendMessage("`Bot został wyłączony. Na razie, wszyscy!`");
        bot.destroy();
    }

    /// Komenda ?siema
    if(msg.content.startsWith(config.prefix + "siema")) {
        msg.reply("No, siema.");
    }

    /// Komenda ?joinchannel
    if(msg.content.startsWith(config.prefix + "joinchannel")) {
        msg.reply("dołączam do kanału **" + parameters.join(" ") + "**");
        JoinCommand(parameters.join(" "));
    }

    /// Komenda ?play
    if(msg.content.startsWith(config.prefix + "play")) {
        PlayCommand(parameters.join(" "), msg);
    }

    /// Komenda ?queue
    if(msg.content.startsWith(config.prefix + "queue")) {
        PlayQueueCommand(msg);
    }

    /// Komenda ?setgame
    if(msg.content.startsWith(config.prefix + "setgame")) {
        if(msg.author.id !== config.ownerID) return msg.channel.sendMessage("Nie masz uprawnień do używania tej komendy!");
        bot.user.setGame(parameters.join(" "));
    }

    /// Komenda ?about
    if(msg.content.startsWith(config.prefix + "about")) {
      msg.channel.sendMessage(`Bot Discord'a, który został napisany w JavaScript (node.js) używając biblioteki discord.js.
      Autor bota: <@${config.ownerID}>
      Wersja bota: 1.2.2
      Repozytorium bota: https://github.com/Xsero/Xsero-Bot
      Link zaproszeniowy: https://discordapp.com/oauth2/authorize?client_id=263663044473651202&scope=bot&permissions=66186303`);
    }

    /// Komenda ?hejtnadlugienogi
    if(msg.content.startsWith(config.prefix + "hejtnadlugienogi")) {
        msg.channel.sendMessage(dlugieNogi[Math.floor(Math.random()*dlugieNogi.length)]);
    }

    /// Komenda ?8ball
    if(msg.content.startsWith(config.prefix + "8ball")) {
      msg.channel.sendMessage("Kula :8ball: odpowiada: **" + eightBall[Math.floor(Math.random()*eightBall.length)] + "**");
    }

    /// Komenda ?say
    if(msg.content.startsWith(config.prefix + "say")) {
      msg.channel.sendMessage(parameters.join(" "));
    }

    /// Komenda ?eval
    if(msg.content.startsWith(config.prefix + "eval")) {
      if(msg.author.id !== config.ownerID) return msg.channel.sendMessage("Nie masz uprawnień do używania tej komendy!");
      try {
        var code = parameters.join(" ");
        var evaled = eval(code);

        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);

        msg.channel.sendCode("xl", clean(evaled));
      } catch(err) {
        msg.channel.sendMessage(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      }
    }
    /// Komenda ?help
    if(msg.content.startsWith(config.prefix + "help")) {
        msg.channel.sendMessage(`W chwili obecnej dostępnych jest 14 komend dla wszystkich i 4 komendy wyłącznie dla właściciela bota:

        Komendy dostępne dla wszystkich:
        **?ping**
        **?myavatar**
        **?myuserinfo**
        **?serverinfo**
        **?stopspam**
        **?siema**
        **?joinchannel**
        **?play**
        **?queue**
        **?hejtnadlugienogi**
        **?say**
        **?help**
        **?about**

        Komendy dostępne wyłącznie dla właściciela bota:
        **?prefix**
        **?setgame**
        **?eval**
        **?shutdown**

        Łączna ilość komend: 18
        Możecie wymyślić propozycje swoich komend. :wink:
        Ponadto należy zwrócić uwagę na to, że bot nie jest jeszcze dopracowany!
        Żeby uzyskać informacje na temat tych komend wpisz **?helpcommand *dowolna komenda***.`);
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
    else if(msg.content.startsWith(config.prefix + "help 8ball")) {
        msg.channel.sendMessage("Zadaje pytanie do kuli 8, która będzie odpowiadała losowo.");
    }
    else if(msg.content.startsWith(config.prefix + "help say")) {
        msg.channel.sendMessage("Powtórzy to, co ty napisałeś.");
    }
    else if(msg.content.startsWith(config.prefix + "help eval")) {
        msg.channel.sendMessage("**(KOMENDA DOSTĘPNA WYŁĄCZNIE DLA WŁAŚCICIELA BOTA!)** Ewaluuje cokolwiek, co użytkownik napisze.")
    }
});
/* FUNKCJE */
/// Wyczyszcza wiadomość
function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return text;
}
/// Włącza ścieżkę audio na podstawie wyników wyszukiwania frazu
function PlayCommand(searchTerm) {
    // jeżeli bot nie jest na żadnym kanale głosowym, dołącz do głównego kanału
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
function PlayQueueCommand(msg) {
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

/* INNE POLECENIA BOTA */
/// Informacja o nowym użytkowniku na serwerze
bot.on("guildMemberAdd", (member) => {
  console.log(`Użytkownik ${member.user.username} dołączył do serwera ${member.guild.name}`);
  member.guild.defaultChannel.sendMessage(`**${member.user.username}** dołączył do nas! Witaj, **${member.user.username}**! :smiley:`);
});

/// Informacja o opuszczeniu/wyrzuceniu użytkownika z serwera
bot.on("guildMemberRemove", (member) => {
  console.log(`Użytkownik ${member.user.username} opuścił serwer ${member.guild.name}`);
  member.guild.defaultChannel.sendMessage(`**${member.user.username}** opuścił nas. :frowning:`);
});

/// Informacja o dołączeniu do nowego serwera
bot.on("guildCreate", (guild) => {
  console.log(`Dodano nowy serwer: ${guild.name}, założony przez ${guild.owner.user.username}.`);
});

// Informacja o opuszczeniu serwera
bot.on("guildDelete", (guild) => {
  console.log(`Opuszczono serwer: ${guild.name}.`);
})

/// Ta funkcja zostaje włączona, gdy bot będzie online
bot.on('ready', () => {
console.log(`Gotowy do aktywności w ${bot.channels.size} kanałach na ${bot.guilds.size} serwerach, łącznie obsługuję ${bot.users.size} użytkowników`);
bot.user.setGame(config.prefix + "help");
});

/// Te funkcje informują konsolę o błędach, ostrzeżeniach i debugowaniach
bot.on('error', e => { console.error(e); });
bot.on('warn', e => { console.warn(e); });
bot.on('debug', e => { console.info(e); });

/// Loguje bota używając specjalnego klucza
bot.login(config.token);
