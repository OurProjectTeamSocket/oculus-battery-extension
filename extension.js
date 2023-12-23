const { GObject, St } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const PanelMenu = imports.ui.panelMenu;
const Mainloop = imports.mainloop;
const Main = imports.ui.main;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
// const myModule = Me.imports.myModule

// const minutesToMiliseconds = myModule.minutesToMiliseconds
// const useCommand = myModule.useCommand

const prefix = '[OBX]'

var HelloWorldButton = GObject.registerClass(
class HelloWorldButton extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'Hello World');

        log(prefix, "INIT")

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

        this.connect('button_press_event', () => {
            try {
                log(`${prefix} pressed`)
            } catch (error) {
                log(`${prefix}: ${error}`)
            }
        });

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

        this.intervalID = GLib.timeout_add(GLib.PRIORITY_DEFAULT, minutesToMiliseconds(1), () => {
            useCommand("echo 123");
            return true; // Do function after X minutes
        });
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