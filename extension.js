import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import St from 'gi://St';

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

// Global varables
const prefix = '[OBX]'
var path
var _settings

const Indicator = GObject.registerClass (
    class Indicator extends PanelMenu.Button {
        _init() {
            super._init(0.0, _('Quest Battery Indicator'));
            
            log(prefix, "Adding icon");

            try {
                this.add_child(new St.Icon({
                    gicon: Gio.icon_new_for_string(path + '/Images/icon.png'),
                    style_class: 'system-status-icon',
                }));
            } catch(error) {
                log(prefix, "Error: ", error);
            }

            log(prefix, "Added icon");

            this.connect('button_press_event', () => { // Button updated problem with icon. and a log with captial L
                log(prefix, "Path to icon", Gio.icon_new_for_string(path + '/Images/icon.png'));
                log(prefix, "Path", path + '/Images/icon.png');
                log(prefix, `Show IP: ${_settings.get_string('ip')}, show time: ${_settings.get_string('time')}`);
            });
                
        }
    }
);

export default class IndicatorExampleExtension extends Extension {
    enable() {
        // Getting data
        path = this.path;
        log(prefix, "path1", path);

        _settings = this.getSettings('org.gnome.shell.extensions.Oculus_Battery_Extension');
        log(prefix, "settings1", _settings);

        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this.uuid, this._indicator);

    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
        _settings = null;
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