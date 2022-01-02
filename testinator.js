imports.gi.versions.Gtk = "3.0";
const { Gio, Gtk, Notify, Gdk, GLib } = imports.gi;



class TestinatorWindow {
  constructor(app) {
    this._app = app;
    this._window = null;
    this._box = null;
    this.notifyButton = null;
    this.guiRestartButton = null;
    this.context = null;
    this.guiRestartCommand = null;
  }
  _buildUI() {

    this._window = new Gtk.ApplicationWindow({
      application: this._app,
      defaultHeight: 200,
      defaultWidth: 200,
    });

    this._box = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
    });

    this.extensionUUIDLabel = new Gtk.Label({ label: "Enter Extension UUID"});
    this.extensionUUIDField = new Gtk.Entry({
      buffer: new Gtk.EntryBuffer()
    });





    this.toggleGrid = new Gtk.Grid()
    this.extensionEnableButton = new Gtk.Button({
      label: "Enable Extension"
    });
    this.extensionEnableButton.connect("clicked", () => {
      if (this.extensionUUIDField.get_buffer().text === "") {
        log(
          "[Testinator] - No UUID was provided! ------------------------------------------------------------------------------------------------------------------------------------------"
        );
        this.alertLabel.set_text("No UUID was provided!")
      } else {
        this.command("gnome-extensions enable " + this.extensionUUIDField.get_buffer().text );

      }
    });
    this.disableExtensionButton = new Gtk.Button({
      label: "Disable Extension"
    });
    this.disableExtensionButton.connect("clicked", () => {
      if (this.extensionUUIDField.get_buffer().text === "") {
        log(
          "[Testinator] - No UUID was provided! ------------------------------------------------------------------------------------------------------------------------------------------"
        );
        this.alertLabel.set_text("No UUID was provided!")
      } else {
        this.command("gnome-extensions disable " + this.extensionUUIDField.get_buffer().text );

      }
    });





    this.extensionRemoveButton = new Gtk.Button({
      label: "Remove Extension"
    });
    this.extensionRemoveButton.connect("clicked", () => {
      if (this.extensionUUIDField.get_buffer().text === "") {
        log(
          "[Testinator] - No UUID was provided! ------------------------------------------------------------------------------------------------------------------------------------------"
        );
        this.alertLabel.set_text("No UUID was provided!")
      } else {
        this.command("gnome-extensions uninstall " + this.extensionUUIDField.get_buffer().text );

      }
    });




    this.journalCtlButton = new Gtk.Button({
      label: "Open GNOME journalctl"
    });
    this.journalCtlButton.connect("clicked", () => {

        this.command("gnome-terminal --window -x bash -c \"journalctl -f -o cat /usr/bin/gnome-shell\"");
        
        
    });





    this.listExtensions = new Gtk.Button({
      label: "List Extensions"
    });
    this.listExtensions.connect("clicked", () => {

        this.command("gnome-extensions list");
    });





    this.testNotifyButton = new Gtk.Button({
      label: "Send Test System Notification"
    });
    Notify.init("Notification Init");
    var notification = new Notify.Notification({
      summary: "Notification Summary",
      body: "Notification Body",
      "icon-name": "dialog-information",
    });
    this.testNotifyButton.connect("clicked", () => {
      log(
        "[Testinator] - Notification Sent! ------------------------------------------------------------------------------------------------------------------------------------------"
      );
      notification.show();
    });
    
    
    
    
    
    this.commandLabel = new Gtk.Label({
      label: "Enter Command"
    });
    this.commandGrid = new Gtk.Grid();
    this.commandField = new Gtk.Entry({
      buffer: new Gtk.EntryBuffer()
    });
    this.commandButton = new Gtk.Button({
      label: "Run Command"
    });
    this.commandButton.connect("clicked", () => {
      if (this.commandField.get_buffer().text === "") {
        log(
          "[Testinator] - No command was provided! ------------------------------------------------------------------------------------------------------------------------------------------"
        );
        this.alertLabel.set_text("No command was provided!")
      }
      this.alertLabel.set_text("")
      log(this.commandField.get_buffer().text);
      this.command(this.commandField.get_buffer().text);
    })





    this.restartGNOME = new Gtk.Button({
      label: "Restart GNOME Shell"
    });
    this.restartGNOME.connect("clicked", () => {
      log(
        "[Testinator] - GNOME Restarted! ------------------------------------------------------------------------------------------------------------------------------------------"
      );
      this.command("busctl --user call org.gnome.Shell /org/gnome/Shell org.gnome.Shell Eval s 'Meta.restart(\"Restarting…\")'");
    })





    this.alertLabel = new Gtk.Label({
      label: ""
    });




    this._box.add(this.extensionUUIDLabel);
    this._box.add(this.extensionUUIDField);
    this._box.add(this.toggleGrid);
    this.toggleGrid.attach(this.extensionEnableButton, 0, 0, 1, 1);
    this.toggleGrid.attach(this.disableExtensionButton, 1, 0, 1, 1);
    this._box.add(this.listExtensions);
    this._box.add(this.testNotifyButton);
    this._box.add(this.extensionRemoveButton);
    this._box.add(this.commandLabel);
    this._box.add(this.commandGrid);
    this._window.add(this._box);
    this.commandGrid.attach(this.commandField, 0, 0, 1, 1);
    this.commandGrid.attach(this.commandButton, 1, 0, 1, 1);
    this._box.add(this.journalCtlButton);
    this._box.add(this.restartGNOME);
    this._box.add(this.alertLabel);

    this._box.show_all();

  }

  getWidget() {
    this._buildUI();
    return this._window;
  }

  command(command) {
    GLib.spawn_command_line_async(command);
  }
}

const application = new Gtk.Application({
  application_id: "org.rrfss.test.Testinator",
  flags: Gio.ApplicationFlags.FLAGS_NONE,
});

application.connect("activate", (app) => {
  let activeWindow = app.activeWindow;

  if (!activeWindow) {
    let testinatorWindow = new TestinatorWindow(app);
    activeWindow = testinatorWindow.getWidget();
  }

  activeWindow.present();
});

application.run(null);
