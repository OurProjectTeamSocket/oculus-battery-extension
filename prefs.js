const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function init() {
    // ExtensionUtils.initTranslations(); 
}

function buildPrefsWidget() {
    let gschema = Gio.SettingsSchemaSource.new_from_directory(
        Me.dir.get_child('schemas').get_path(),
        Gio.SettingsSchemaSource.get_default(),
        false
    );

    this.settings = new Gio.Settings({
        settings_schema: gschema.lookup('org.gnome.shell.extensions.Oculus_Battery_Extension', true)
    });

    let frame = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
    });

    let vbox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
    });
    vbox.set_margin_top(15);

    let stringSetting = createStringSetting();
    vbox.append(stringSetting);

    frame.append(vbox);

    frame.show();

    return frame;
}

function createStringSetting() {
    let vbox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL
    });

    let hbox = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL
    })

    let hbox2 = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL
    });

    hbox.set_margin_top(5);
    hbox2.set_margin_top(20);

    let settingLabel = new Gtk.Label({
        label: "Example String",
        halign: Gtk.Align.START,
    });
    // settingLabel.set_margin_right(10) Doesn't work

    let settingEntry = new Gtk.Entry({
        text: this.settings.get_string('example-string')
    });
    // settingEntry.set_margin_right(10)

    let settingButton = new Gtk.Button({
        label: "submit",
    })

    // Creating practically the same objects again and again 
    // (setting Label, Entry, Button etc)
    // because otherwise it doesn't show the second object. 
    // (these labels etc can't be used second time)
    // That's why the code is so long and cannot be shortened :/
    
    let settingLabel2 = new Gtk.Label({
        label: "Example String",
        halign: Gtk.Align.START
    });

    let settingEntry2 = new Gtk.Entry({
        text: this.settings.get_string('example-string')
    });

    let settingButton2 = new Gtk.Button({
        label: "submit",
    })

    settingEntry.connect('notify::text', (entry) => {
        this.settings.set_string('example-string', entry.text);
    });

    // First row of label, text input and submit button
    hbox.append(settingLabel);
    hbox.append(settingEntry);
    hbox.append(settingButton);

    // Second row of the same objects
    hbox2.append(settingLabel2);
    hbox2.append(settingEntry2);
    hbox2.append(settingButton2);

    // Appending to container (hbox)
    vbox.append(hbox)
    vbox.append(hbox2)

    // Returning ONE BOX with all appended boxes
    return vbox;
}