const { GObject, St } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const PanelMenu = imports.ui.panelMenu;
const Mainloop = imports.mainloop;
const Main = imports.ui.main;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;

//my imports
const Functions = Me.imports.functions.Functions;

const prefix = '[OBX]'
let gschema
var settings

var HelloWorldButton = GObject.registerClass(
class HelloWorldButton extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'Hello World');

        log(prefix, "INIT")

        // Connecting to data base
        gschema = Gio.SettingsSchemaSource.new_from_directory(
            Me.dir.get_child('schemas').get_path(),
            Gio.SettingsSchemaSource.get_default(),
            false
        );

        // This too
        settings = new Gio.Settings({
            settings_schema: gschema.lookup('org.gnome.shell.extensions.Oculus_Battery_Extension', true)
        });

        log(prefix, Me.dir.get_path())

        let icon
        try {
            icon = new St.Icon({
                gicon: Gio.icon_new_for_string(Me.dir.get_path() + '/Images/sonic.png'), // WORK ONLY IF I GIVE A FULL PATH
                style_class: 'system-status-icon'
            });
        } catch (error) {
            log(`${prefix}: ${error}`)
        }

        log(`${prefix} Ikona: ${icon}`) // This adds logs - se se logs use this: journalctl -f -o cat /usr/bin/gnome-shell and restart gnome // color text don't work

        this.connect('button_press_event', () => { // Button updated problem with icon. and a log with captial L
            log(prefix, `Show IP: ${settings.get_string('ip')}, show time: ${settings.get_int('time')}`)
        });

        //Test of adding own functions and imports - works <3
        try {
            let funcs = new Functions(settings);
            funcs.Test();
        } catch (error) {
            log(`${prefix}: ${error}`)
        }

        this.add_child(icon);
    }
});

class Extension {
    constructor() {
        this.intervalID = null;
    }

    enable() {
        this._indicator = new HelloWorldButton();
        Main.panel.addToStatusArea('hello-world', this._indicator);

        // TODO: Add a reset if time was changed in options

        try {

            var initialTime = settings.get_int('time');

            this.intervalID = GLib.timeout_add(GLib.PRIORITY_DEFAULT, minutesToMiliseconds(settings.get_int('time')), () => { // here I'm retarded and I tired to get a int with string method
                bodyOfLoop();
                log(prefix, -1);
                let currentTime = settings.get_int('time');
                log(prefix, 0);
                if (currentTime !== initialTime) {
                    log(prefix, 1);
                    log(prefix, "Time has changed from " + initialTime + " to " + currentTime);
                    if (this.intervalID) {
                        GLib.source_remove(this.intervalID);
                        this.intervalID = null;
                    }

                    log(prefix, 2);

                    initialTime = currentTime;

                    log(prefix, 3);

                    this.intervalID = GLib.timeout_add(GLib.PRIORITY_DEFAULT, minutesToMiliseconds(currentTime), () => {
                        bodyOfLoop();
                        return true;
                    });
                    
                }
                
                log(prefix, 4);

                return true;
            });
        
        } catch (error) {
            log(`${prefix}: ${error}`)
        }

    }

    disable() {
        if (this.intervalID) {
            GLib.source_remove(this.intervalID);
            this.intervalID = null;
        }
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init() {
    return new Extension();
}

useCommand = (commandInput) => {
    let [result, stdout, stderr] = GLib.spawn_command_line_sync(commandInput)

    if (result) {
         log(`${prefix} Output: ${stdout.toString()}`)
         return stdout.toString();
    } else {
        log(`${prefix} Error: ${stderr.toString()}`)
        return false;
    }
}

minutesToMiliseconds = (minutes) => {
    if(!Number.isInteger(minutes)) {
        log(prefix, "FATAL ERROR: time is null")
        return 1
    } else {
        return ( minutes * 60 ) * 1000
    }
}

function bodyOfLoop() {

    var date = new Date();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    date.setHours(hour, minutes, seconds);

    log(prefix, "Loop works", settings.get_int('time'), "time:", date.toLocaleTimeString())

        //     // TODO: Add a checking if oculus quest is sill connecting IF NOT then try to reccoenct 5 times IF THIS FAILS (IDK, maybe) stop looking and wait for refresh ( to this we need to add buton )
    if((settings.get_string('ip') == null)||(settings.get_string('ip') == "")) {
        log(prefix, "FATAL ERROR: ip is null or blank")
    }
        //     if(!useCommand(`adb -s ${settings.get_string('ip')}:5555 shell dumpsys battery | grep -E "level|AC|USB"`)) {
        //         // TODO: Set a error icon ( for now can be any icon )
        //     } else {
        //         // TODO: Check the power level, and type of chargeing and choose a good one.
        //         // TODO: Check if you can set a diffrent colors for icon ( in top bar ) IF YES THEN we don't have to set other icons for other power levels we can just do a grandient from (RGB) 0,255,0 ( top level ) to 255,0,0 ( dead battery )
        //     }
}

// function DebugLog(Text) {
//     var date = new Date();
//     var hour = date.getHours();
//     var minutes = date.getMinutes();
//     var seconds = date.getSeconds();
//     date.setHours(hour, minutes, seconds);
//     log()
// }