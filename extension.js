const { GObject, St } = imports.gi;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const Gio = imports.gi.Gio;

const prefix = '[OBX]'

let panelButton, panelButtonText, timeout
let counter = 0

const setButtonText = () => {
    counter++
    panelButtonText.set_text( counter.toString() )
}

const setButtonText = () => {
    counter++
    panelButtonText.set_text( counter.toString() )

    log(`${prefix}, counter: ${counter} or ${counter.toString()}`)
}

var HelloWorldButton = GObject.registerClass(
class HelloWorldButton extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'Hello World');

        let icon = new St.Icon({
            gicon: Gio.icon_new_for_string('/home/mati/.local/share/gnome-shell/extensions/test@myextensions.example.com/Images/sonic.png'), // WORK ONLY IF I GIVE A FULL PATH
            style_class: 'system-status-icon'
        });        

        log(prefix, " Ikona: ", icon) // This adds logs - se se logs use this: journalctl -f -o cat /usr/bin/gnome-shell and restart gnome // color text don't work

        this.connect('button_press_event', () => {
            log(prefix, "Pressed")
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
