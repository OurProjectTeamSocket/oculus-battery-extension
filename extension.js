import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import St from 'gi://St';

import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

// Global varables
const prefix = '[OBX]'
var path
var _settings

var timeoutId;

const Indicator = GObject.registerClass(
    class Indicator extends PanelMenu.Button {
        _init() {
            super._init(0.0, _('Quest Battery Indicator'));

            log(prefix, "Adding icon");

            try {
                this.add_child(new St.Icon({
                    gicon: Gio.icon_new_for_string(path + '/Images/oculusicon.svg'), //  Icon to change
                    style_class: 'system-status-icon',
                }));
            } catch (error) {
                log(prefix, "Error: ", error);
            }

            log(prefix, "Added icon");

            this.connect('button_press_event', () => { // Button updated problem with icon. and a log with captial L
                log(prefix, "Path to icon", Gio.icon_new_for_string(path + '/Images/icon.png'));
                log(prefix, "Path", path + '/Images/icon.png');
                log(prefix, `Show IP: ${_settings.get_string('ip')}, show time: ${_settings.get_int('time')}`);
            });

            try {
                log(prefix, "Starting timeout");
                startTimeout();

                _settings.connect('changed', () => {
                    log(prefix, "Settings changed");
                    startTimeout();
                });
            } catch (error) {
                log(prefix, "Error: ", error);
            }

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

function minutesToMilliseconds(minutes) {
    if (!Number.isInteger(minutes)) {
        log(prefix, "FATAL ERROR: time is null")
        return 1
    } else {
        return (minutes * 60) * 1000
    }
}

function startTimeout() {
    log(prefix, "Removing timeout");

    GLib.Source.remove(timeoutId);

    // Set a new timeout
    let newMinutes = _settings.get_int('time');
    timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, newMinutes, () => {

        log(prefix, "Updating battery status");

        let output = useCommand(`adb -s ${_settings.get_string('ip')}:5555 shell dumpsys battery | grep -E "level|AC|USB"`);

        log(prefix, "Output: ", output);

        if (output.includes("AC powered") && output.includes("USB powered") && output.includes("level")) {
            // Process the result to get the values
            let acPowered = output.includes("AC powered: true");
            let usbPowered = output.includes("USB powered: true");
            let levelMatch = output.match(/level: (\d+)/);
            let level = levelMatch ? parseInt(levelMatch[1]) : null;

            // Update the structure
            let batteryStatus = {
                acPowered: acPowered,
                usbPowered: usbPowered,
                level: level
            };

            // @Sycinz I remember you wanted to do a dropdown(?) with the battery status
            // So now you can use the batteryStatus variable to do that
        }

        return true; // return true to keep the timeout going
    });
}