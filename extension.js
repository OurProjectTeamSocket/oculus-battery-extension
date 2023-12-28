import GObject from 'gi://GObject';
import St from 'gi://St';

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

// Global varables
const prefix = '[OBX]'
let gschema
var settings

const Indicator = GObject.registerClass (
    class Indicator extends PanelMenu.Button {
        _init() {
            super._init(0.0, _('Quest Battery Indicator'));

            log(prefix, Me.dir.get_path())
            
            this.add_child(new St.Icon({
                icon_name: 'face-smile-symbolic',
                style_class: 'system-status-icon',
            }));

            this.connect('button_press_event', () => { // Button updated problem with icon. and a log with captial L
                log(prefix, `Show IP: ${this._settings.get_string('ip')}, show time: ${this._settings.get_string('time')}`)
            });

            this.menu.addMenuItem(item);
        }
    }
);

export default class IndicatorExampleExtension extends Extension {
    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this.uuid, this._indicator);

        // gschema = Gio.SettingsSchemaSource.new_from_directory(
        //     Me.dir.get_child('schemas').get_path(),
        //     Gio.SettingsSchemaSource.get_default(),
        //     false
        // );

        // settings = new Gio.Settings({
        //     settings_schema: gschema.lookup('org.gnome.shell.extensions.Oculus_Battery_Extension', true)
        // });

        this._settings = this.getSettings('org.gnome.shell.extensions.Oculus_Battery_Extension');

    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}

function useCommand(commandInput) {
    let [result, stdout, stderr] = GLib.spawn_command_line_sync(commandInput)

    if (result) {
         log(`${prefix} Output: ${stdout.toString()}`)
         return stdout.toString();
    } else {
        log(`${prefix} Error: ${stderr.toString()}`)
        return false;
    }
}

function minutesToMiliseconds(minutes) {
    if(!Number.isInteger(minutes)) {
        log(prefix, "FATAL ERROR: time is null")
        return 1
    } else {
        return ( minutes * 60 ) * 1000
    }
}