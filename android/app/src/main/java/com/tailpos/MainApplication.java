package com.tailpos;

import android.app.Application;

import com.solinor.bluetoothstatus.RNBluetoothManagerPackage;
import com.facebook.react.ReactApplication;
import com.pilloxa.backgroundjob.BackgroundJobPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import it.innove.BleManagerPackage;
import dog.craftz.sqlite_2.RNSqlite2Package;
import com.github.yamill.orientation.OrientationPackage;
import org.reactnative.camera.RNCameraPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.rusel.RCTBluetoothSerial.RCTBluetoothSerialPackage;
import com.ekreutz.barcodescanner.BarcodeScannerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new RNBluetoothManagerPackage(),
            new MainReactPackage(),
            new BackgroundJobPackage(),
            new RNDeviceInfo(),
            new SplashScreenReactPackage(),
            new RNSqlite2Package(),
            new BleManagerPackage(),
            new OrientationPackage(),
            new RNCameraPackage(),
            new VectorIconsPackage(),
            new RNSoundPackage(),
            new RCTBluetoothSerialPackage(),
            new BarcodeScannerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
