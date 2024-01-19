import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class ExamplePreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        // Create a preferences page, with a single group
        const page = new Adw.PreferencesPage({
            title: _('General'),
            icon_name: 'dialog-information-symbolic',
        });
        window.add(page);

        const group = new Adw.PreferencesGroup({
            title: _('Appearance'),
            description: _('Configure the appearance of the extension'),
        });
        page.add(group);

        // Create a new preferences row with label and text input
        const row1 = new Adw.EntryRow({
            title: _('IP Address'),
        });
        group.add(row1);

        // Create another preferences row with label and SpinButton
        const spinButton = new Gtk.SpinButton({
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 60,
                step_increment: 1,
            }),
            climb_rate: 1.0,
            digits: 0,
        });
        const row2 = new Adw.ActionRow({
            title: _('Time between updates (minutes)'),
            child: spinButton,
        });
        group.add(row2);

        // Create a settings object and bind the rows to the respective keys
        window._settings = this.getSettings();
        window._settings.bind('ip', row1, 'text',
            Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('time', spinButton, 'value',
            Gio.SettingsBindFlags.DEFAULT);
    }
}