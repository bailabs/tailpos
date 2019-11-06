package com.tailpos;

import android.os.Bundle;
import android.view.KeyEvent; // <--- import
import net.kangyufei.KeyEventModule; // <--- import
import org.devio.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "TailPOS";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);
    }

  @Override  // <--- Add this method if you want to react to keyDown
  public boolean onKeyDown(int keyCode, KeyEvent event) {

    KeyEventModule.getInstance().onKeyDownEvent(keyCode, event);
    super.onKeyDown(keyCode, event);
    return true;
  }

  @Override  // <--- Add this method if you want to react to keyUp
  public boolean onKeyUp(int keyCode, KeyEvent event) {
    KeyEventModule.getInstance().onKeyUpEvent(keyCode, event);

    super.onKeyUp(keyCode, event);
    return true;
  }

}
