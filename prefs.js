const {St, Clutter} = imports.gi;
const Main = imports.ui.main;

class HelloWorldExtension {
    constructor() {
        this.panelButton = new St.Bin({
            style_class: "panel-button",
        });

        let panelButtonText = new St.Label({
            text: "Hello World",
            y_align: Clutter.ActorAlign.CENTER,
        });

        this.panelButton.set_child(panelButtonText);
    }

    enable() {
        Main.panel._rightBox.insert_child_at_index(this.panelButton, 0);
    }

    disable() {
        Main.panel._rightBox.remove_child(this.panelButton);
    }
}

let helloWorldExtension;

function init() {
    helloWorldExtension = new HelloWorldExtension();
}

function enable() {
    helloWorldExtension.enable();
}

function disable() {
    helloWorldExtension.disable();
}
