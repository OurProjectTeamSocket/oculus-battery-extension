const { GObject, St } = imports.gi;

const PanelMenu = imports.ui.panelMenu;
const Main = imports.ui.main;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;

const prefix = '[OBX]'
const prefixC = '[COUNT]'

let panelButton, panelButtonText, timeout
let counter = 0

var path = GLib.get_current_dir() + '/.local/share/gnome-shell/extensions/test@myextensions.example.com/';

const setButtonText = () => {
    counter++
    panelButtonText.set_text( counter.toString() )

    log(`${prefixC}, counter: ${counter} or ${counter.toString()}`)
}

var HelloWorldButton = GObject.registerClass(
class HelloWorldButton extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'Hello World');

        log(prefix, "INIT")

        // Temporary fix for diffrent users to use a inages from relative folder
        log(prefix, path + '/Images/sonic.png')

        let icon = new St.Icon({
            gicon: Gio.icon_new_for_string(path + '/Images/sonic.png'), // WORK ONLY IF I GIVE A FULL PATH
            style_class: 'system-status-icon'
        });

        log(`${prefix} Ikona: ${icon}`) // This adds logs - se se logs use this: journalctl -f -o cat /usr/bin/gnome-shell and restart gnome // color text don't work

        this.connect('button_press_event', () => {
            log(`${prefix} pressed`)
            setButtonText()
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
