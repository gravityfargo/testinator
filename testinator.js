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

    //WM Restarter
    const guiRestartButton = new Gtk.Button({ label: "Restart GNOME" });
    guiRestartButton.connect("clicked", () => {
      log(
        "[Testinator] - GNOME Restarted ------------------------------------------------------------------------------------------------------------------------------------------"
      );
      this.guiRestarter();
    });
    this._box.add(guiRestartButton);

    //Notifcation Tester
    Notify.init("Notification Init");
    var notification = new Notify.Notification({
      summary: "Notification Summary",
      body: "Notification Body",
      "icon-name": "dialog-information",
    });
    const notifyButton = new Gtk.Button({ label: "Send Test Notification" });
    notifyButton.connect("clicked", () => {
      log(
        "[Testinator] - Notification Sent ------------------------------------------------------------------------------------------------------------------------------------------"
      );
      notification.show();
    });
    this._box.add(notifyButton);
    this._box.show_all();

    this._window.add(this._box);
  }

  getWidget() {
    this._buildUI();
    return this._window;
  }

  guiRestarter() {
    GLib.spawn_command_line_async(
      "busctl --user call org.gnome.Shell /org/gnome/Shell org.gnome.Shell Eval s 'Meta.restart(\"Restarting…\")'"
    );
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
