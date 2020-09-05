const fs = require("fs");
const demofile = require("demofile");

const players = [];
const playerInfos = {};

fs.readFile("gambit-youngsters-vs-ago-m1-dust2.dem", (err, buffer) => {
    const demoFile = new demofile.DemoFile();

    demoFile.gameEvents.on("round_start", e => {
        players.forEach(player => {
            playerInfos[player] = false;
        })
        console.log(
            "*** Round started '%s'",
            demoFile.gameRules.phase,
        );
    });

    demoFile.gameEvents.on("round_officially_ended", e => {
        players.forEach(name => {
            if (!playerInfos[name]) {
                console.log(`\x1b[31m\tPlayer '${name}' stucked!\x1b[37m`);
            }
        });
        const teams = demoFile.teams;

        const terrorists = teams[2];
        const cts = teams[3];

        console.log(
            "\tTerrorists: %s score %d\n\tCTs: %s score %d",
            terrorists.clanName,
            terrorists.score,
            cts.clanName,
            cts.score
        );
    });
    demoFile.entities.on("create", e => {
        // We're only interested in player entities being created.
        if (!(e.entity instanceof demofile.Player)) {
            return;
        }

        if(e.entity.name.indexOf('GOTV') === -1) {
            players.push(e.entity.name);
        }
        // if(players.indexOf(e.entity.name) !== -1) {
        //     players.push(e.entity.name);
        // }
        console.log(
            "[Time: %d] %s (%s) joined the game",
            demoFile.currentTime,
            e.entity.name,
            e.entity.steamId
        );
    });

    demoFile.entities.on("change", e => {
        if (!(e.entity instanceof demofile.Player)) {
            return;
        }
        if (e.tableName.indexOf('DT_CSLocalPlayerExclusive') !== -1) {
            playerInfos[e.entity.name] = true;
        }

    });

    demoFile.parse(buffer);
});