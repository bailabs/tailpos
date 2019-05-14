<div align="center">
 <h2>TailPOS</h2>
 <p align="center">
  <p>TailPOS  an Offline First Open Source POS for ERPNext</p>
  <a href='https://play.google.com/store/apps/details?id=com.tailpos&hl=en&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png' width='25%' /></a>
 </p>
</div>

### Showcase

![Showcase](showcase.gif)

### Features

<b> o Two Way Sync to ERPNext </b>
  Two way syncing to an ERPNext instance for a full suite of back-office functionalities.

<b> o Offline-first Approach </b>
  Continue to make sales and keep running the business even no  internet or unstable.

<b> o Mobile POS </b>
  Uses the tablet for a lightweight setup. Built-in rear camera of the tablet can be used as a barcode scanner. Any bluetooth barcode scanner is compatible with TailPOS app as well.

<b> o Print receipts </b>
  Print sales receipts for customers using any ESC/P receipt printer.

<b> o Multiple payment modes </b>
  Can process credit card,mobile payments and cash.

<b> o Discounts Program </b>
  Can apply discount to an invoice or on specific items.

<b> o Inventory Management </b>
  Keep track of stock levels easily. Easy-to-use menu for item maintenance such as creating and updating item information.

<b> o Sales Reports </b>
  Can generate X and Z readings and attendant shift sales totals.

### License
This project is released under the GPLv3 license, for more details, take a look at the LICENSE file in the source.

---

If you are a developer who wants to compile the mobile app and help contribute to the project please follow 
the instructions below


### Quick Start
A quick demo of syncing the Tailpos mobile app to a frappe/erpnext server

https://docs.tailpos.com/tailpos/syncing-to-frappe-erpnext

Login to demo server
server: https://demo.tailerp.com
username: Administrator
password: 123456
making a new item
Go To Item List.
Make a new item.
Select your new item to see its properties.

![alt text](https://github.com/bailabs/tailpos/blob/master/pics/item%20created.png)

Select item price under Pricing.
Make sure the “In TailPOS” checkbox is checked.

![alt text](https://github.com/bailabs/tailpos/blob/master/pics/checkbox.png)

Then save your item properties.
TailPOS app side
Go to settings>sync
Fill up sync settings
ERPnext Server: https://demo.tailerp.com
Username: Administrator
Password: 123456
Device ID: <>
Setting up device ID
To create Device ID go to device list then make new device.
Create device name and POS profile.
Fill out information need in the POS profile:
Name: <>
Series: ACC-SINV-.YYYY.-
Accounting
Write Off Accounting: Write Off – D
Write Off Cost Center: Main – D

![alt text](https://github.com/bailabs/tailpos/blob/master/pics/pos%20profile.png)

![alt text](https://github.com/bailabs/tailpos/blob/master/pics/write%20off.png)

Select your new device.
Device ID is displayed at the top right corner near the save button.


![alt text](https://github.com/bailabs/tailpos/blob/master/pics/device%20name.png)

Syncing
Once your done saving the sync settings, “Force Sync” the settings.
Once sync is successful, go to your sales tab and fill up a sample transaction.
Confirm the transaction by looking at your “Receipts” tab.

Now go back to your Settings>Sync and force sync the receipt data to the server.
Verify by going to “Receipts” list and check the receipts that was generated.

### How To Install

First, you'll need NodeJS and NPM:

```terminal
sudo apt install curl
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
nodejs -v
v8.4.0
```

Install development tools to build native addons:
```terminal
sudo apt-get install gcc g++ make
```
Install the Yarn package manager, run:
```terminal
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```

Then you can install react-native using `npm`

```terminal
sudo npm install -g react-native-cli
```

Now you need to install Java/ Android

```terminal
sudo apt-get install default-jre
sudo apt-get install default-jdk

sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
sudo apt-get install oracle-java8-installer
```

* Install Android
* Install Android SDK requirements

```terminal
cd ~
mkdir android-sdk
cd android-sdk
wget https://dl.google.com/android/repository/sdk-tools-linux-3859397.zip
sudo apt-get install unzip
unzip sdk-tools-linux-3859397.zip
```

We add the path of our Android SDK tools to .bashrc so that we have access to the Android tools.
```
cd ~
nano .bashrc

# Add these lines to the top of the file
export ANDROID_HOME=$HOME/android-sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# CTRL+O (uppcase o) to save
# CTRL+X to exit

source ~/.bashrc
```

Now we have access to the android command
```terminal

android update sdk --no-ui
# Answer 'y' to all prompts

sdkmanager "platforms;android-23" "build-tools;23.0.1" "add-ons;addon-google_apis-google-23"
```

Installing tailpos mobile app
```terminal
cd ~
mkdir Projects
cd Projects
git clone https://github.com/bailabs/tailpos.git
cd tailpos
yarn
```

Updating react-native-camera modules
  * remove buildscript section

```terminal
  buildscript {
  repositories {
    jcenter()
    maven {
      url 'https://maven.google.com'
    }
  }

  dependencies {
    classpath 'com.android.tools.build:gradle:3.0.0'
  }
}
```

  * compileOnly to provided
  * implemenation to compile

```terminal
cd ~
nano Projects/tailpos/node_modules/react-native-camera/android/build.gradle
```

Updating react-native-maps modules
  * compileOnly to provided
  * implemenation to compile

```terminal
cd ~
nano Projects/tailpos/node_modules/react-native-maps/lib/android/build.gradle
```


Updating react-native-bluetooth-serial modules
  * remove @Override in line 23 (the second @Override)

```terminal
cd ~
nano Projects/tailpos/node_modules/react-native-bluetooth-serial/android/src/main/java/com/rusel/RCTBluetoothSerial/RCTBluetoothSerialPackage.java
```


Building tailpos

```terminal
cd ~
cd Projects/tailpos
react-native run-android
```





