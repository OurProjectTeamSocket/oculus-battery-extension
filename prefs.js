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
        orientation: Gtk.Orientation.HORIZONTAL
    });

    // let vbox2 = new Gtk.Box({
    //     orientation: Gtk.Orientation.VERTICAL,
    // });

    vbox.set_margin_top(5);
    // vbox2.set_margin_top(10);

    let settingLabel = new Gtk.Label({
        label: "Example String",
        halign: Gtk.Align.START
    });

    let settingEntry = new Gtk.Entry({
        text: this.settings.get_string('example-string')
    });

    let settingButton = new Gtk.Button({
        label: "submit",
    })

    settingEntry.connect('notify::text', (entry) => {
        this.settings.set_string('example-string', entry.text);
    });

    // First line of label, text input and submit button
    vbox.append(settingLabel);
    vbox.append(settingEntry);
    vbox.append(settingButton);

    // Second one
    // vbox2.append(settingLabel);
    // vbox2.append(settingEntry);
    // vbox2.append(settingButton);

    return vbox;
}