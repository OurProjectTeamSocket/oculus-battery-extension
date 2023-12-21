const { GObject, St } = imports.gi;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const Gio = imports.gi.Gio;

var prefix = '[OBX]'

var HelloWorldButton = GObject.registerClass(
class HelloWorldButton extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'Hello World');

        let icon = new St.Icon({
            gicon: Gio.icon_new_for_string('/home/nintys/.local/share/gnome-shell/extensions/test@myextensions.example.com/Images/sonic.png'), // WORK ONLY IF I GIVE A FULL PATH
            style_class: 'system-status-icon'
        });        

        log(prefix, " Ikona: ", icon) // This adds logs - se se logs use this: journalctl -f -o cat /usr/bin/gnome-shell and restart gnome // color text don't work

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
