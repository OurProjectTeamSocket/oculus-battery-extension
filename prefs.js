const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

// var settingsData;

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

    // settingsData = this.settings;

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

    let hbox3 = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL
    });

    hbox.set_margin_top(20);
    hbox2.set_margin_top(20);
    hbox3.set_margin_top(20)

    let settingLabel = new Gtk.Label({
        label: "IP Adress of a Quest    ",
        halign: Gtk.Align.START,
    });
    // settingLabel.set_margin_right(10) Doesn't work

    let settingEntry = new Gtk.Entry({
        text: this.settings.get_string('ip')
    });
    // if(settings.get_string('ip') != "") { TODO: Add later a checking if IP is correct IP ( no other characters ) and isn't a null or blank space @Sycinz
    //     settingEntry.text = settings.get_string('ip');
    // }
    // // settingEntry.set_margin_right(10)

    let settingButton = new Gtk.Button({
        label: "submit",
    })

    // Creating practically the same objects again and again 
    // (setting Label, Entry, Button etc)
    // because otherwise it doesn't show the second object. 
    // (these labels etc can't be used second time)
    // That's why the code is so long and cannot be shortened :/
    
    let settingLabel2 = new Gtk.Label({
        label: "Time to refresh a battery level    ",
        halign: Gtk.Align.START
    });

    //  Supposed to be int entry (idk how to filter type of input)
    let adjustment = new Gtk.Adjustment({
        lower: 1,
        upper: 100,
        step_increment: 1,
    })

    let settingEntry2 = new Gtk.SpinButton({
        adjustment: adjustment,
        climb_rate: 1.0,
        digits: 0,
    })

    settingEntry2.value = settings.get_int('time');

    let settingButton2 = new Gtk.Button({
        label: "submit",
    })

    // Objects, to the third hbox (hbox3 in this case)
    let settingButton3 = new Gtk.Button({
        label: "button_init",
    })

    settingButton3.connect('clicked', () => {
        // useCommand('adb tcpip 5555 && adb connect ip:5555') TODO: this don't work for now BUT we find a way to implement file OR We will add it there too
    });

    let settingButton4 = new Gtk.Button({
        label: "button_save",
    })

    settingButton4.connect('clicked', () => {
        this.settings.set_string('ip', settingEntry.text);
        this.settings.set_int('time', settingEntry2.value);
    });

    // First row of label, text input and submit button
    hbox.append(settingLabel);
    hbox.append(settingEntry);
    hbox.append(settingButton);

    // Second row of the same objects
    hbox2.append(settingLabel2);
    hbox2.append(settingEntry2);
    hbox2.append(settingButton2);

    // Third one with a button at first and a save button
    hbox3.append(settingButton3)
    hbox3.append(settingButton4)

    // Appending to container (hbox)
    vbox.append(hbox)
    vbox.append(hbox2)
    vbox.append(hbox3)

    // Returning ONE BOX with all appended horizontal boxes 
    return vbox;
}