const { GObject, St } = imports.gi;

const PanelMenu = imports.ui.panelMenu;
const Main = imports.ui.main;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;

const prefix = '[OBX]'

var path = GLib.get_current_dir() + '/.local/share/gnome-shell/extensions/Oculus-Battery-Extension@ourprojectteam.com';

var HelloWorldButton = GObject.registerClass(
class HelloWorldButton extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'Hello World');

        log(prefix, "INIT")

        // Temporary fix for diffrent users to use a inages from relative folder
        log(prefix, path + '/Images/sonic.png')
        let icon = ""
        try {
            icon = new St.Icon({
                gicon: Gio.icon_new_for_string(path + '/Images/sonic.png'), // WORK ONLY IF I GIVE A FULL PATH
                style_class: 'system-status-icon'
            });
        } catch (error) {
            log(prefix, error)
        }

        log(`${prefix} Ikona: ${icon}`) // This adds logs - se se logs use this: journalctl -f -o cat /usr/bin/gnome-shell and restart gnome // color text don't work

        this.connect('button_press_event', () => {
            try {
                log(`${prefix} pressed`)
                // setButtonText()
                useCommand("pwd");
            } catch (error) {
                log(prefix, error)
            }
        });

        this.add_child(icon);
    }
});

class Extension {
    constructor() {
    }

    enable() {
        this._indicator = new HelloWorldButton();
        Main.panel.addToStatusArea('hello-world', this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init() {
    return new Extension();
}

function useCommand(commandInput) {
    let [result, stdout, stderr] = GLib.spawn_command_line_sync(commandInput);
    result ? log(`${prefix} Wynik: ${stdout.toString()}`) : log(`${prefix} Błąd ${stderr.toString()}`)
}