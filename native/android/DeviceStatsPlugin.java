package com.mogu.tuneup;

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.BatteryManager;
import android.os.Build;
import android.os.Environment;
import android.os.StatFs;
import android.provider.Settings;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;

/**
 * Reads real device status (storage, RAM, battery, temperature), clears THIS app's own cache
 * and opens official Android settings screens. Uses only public APIs and needs no
 * extra permissions, so it is fully compliant with Google Play policy.
 */
@CapacitorPlugin(name = "DeviceStats")
public class DeviceStatsPlugin extends Plugin {

    @PluginMethod
    public void getStats(PluginCall call) {
        Context ctx = getContext();
        JSObject o = new JSObject();

        StatFs fs = new StatFs(Environment.getDataDirectory().getPath());
        o.put("diskTotal", fs.getTotalBytes());
        o.put("diskFree", fs.getAvailableBytes());

        ActivityManager am = (ActivityManager) ctx.getSystemService(Context.ACTIVITY_SERVICE);
        ActivityManager.MemoryInfo mi = new ActivityManager.MemoryInfo();
        am.getMemoryInfo(mi);
        o.put("ramTotal", mi.totalMem);
        o.put("ramFree", mi.availMem);

        Intent b = ctx.registerReceiver(null, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
        if (b != null) {
            int level = b.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
            int scale = b.getIntExtra(BatteryManager.EXTRA_SCALE, 100);
            if (level >= 0 && scale > 0) o.put("batteryLevel", level * 100.0 / scale);
            int status = b.getIntExtra(BatteryManager.EXTRA_STATUS, -1);
            o.put("charging", status == BatteryManager.BATTERY_STATUS_CHARGING || status == BatteryManager.BATTERY_STATUS_FULL);
            int temp = b.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, -1);
            if (temp > 0) o.put("batteryTemp", temp / 10.0);
            o.put("batteryHealth", healthName(b.getIntExtra(BatteryManager.EXTRA_HEALTH, 1)));
        }

        o.put("model", Build.MODEL);
        o.put("manufacturer", Build.MANUFACTURER);
        o.put("androidVersion", Build.VERSION.RELEASE);
        o.put("cores", Runtime.getRuntime().availableProcessors());
        call.resolve(o);
    }

    @PluginMethod
    public void clearCache(PluginCall call) {
        long freed = 0;
        freed += clearDir(getContext().getCacheDir());
        freed += clearDir(getContext().getExternalCacheDir());
        JSObject o = new JSObject();
        o.put("freed", freed);
        call.resolve(o);
    }

    @PluginMethod
    public void openSettings(PluginCall call) {
        String target = call.getString("target", "");
        String action;
        switch (target) {
            case "storage": action = Settings.ACTION_INTERNAL_STORAGE_SETTINGS; break;
            case "battery": action = Intent.ACTION_POWER_USAGE_SUMMARY; break;
            case "batteryOptimization": action = Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS; break;
            case "apps": action = Settings.ACTION_APPLICATION_SETTINGS; break;
            case "defaultApps": action = Settings.ACTION_MANAGE_DEFAULT_APPS_SETTINGS; break;
            case "data": action = Settings.ACTION_DATA_USAGE_SETTINGS; break;
            case "display": action = Settings.ACTION_DISPLAY_SETTINGS; break;
            default: action = Settings.ACTION_SETTINGS;
        }
        try {
            startSettings(action);
        } catch (Exception e) {
            try {
                startSettings(Settings.ACTION_SETTINGS);
            } catch (Exception ignored) {
                // nothing else we can do
            }
        }
        call.resolve();
    }

    private void startSettings(String action) {
        Intent i = new Intent(action);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getContext().startActivity(i);
    }

    /** Deletes the contents of a directory (not the directory itself) and returns bytes removed. */
    private long clearDir(File dir) {
        long total = 0;
        if (dir == null || !dir.isDirectory()) return 0;
        File[] children = dir.listFiles();
        if (children == null) return 0;
        for (File f : children) {
            if (f.isDirectory()) total += clearDir(f);
            long size = f.isFile() ? f.length() : 0;
            if (f.delete()) total += size;
        }
        return total;
    }

    private String healthName(int h) {
        switch (h) {
            case BatteryManager.BATTERY_HEALTH_GOOD: return "Good";
            case BatteryManager.BATTERY_HEALTH_OVERHEAT: return "Overheating";
            case BatteryManager.BATTERY_HEALTH_DEAD: return "Dead";
            case BatteryManager.BATTERY_HEALTH_OVER_VOLTAGE: return "Over voltage";
            case BatteryManager.BATTERY_HEALTH_COLD: return "Cold";
            case BatteryManager.BATTERY_HEALTH_UNSPECIFIED_FAILURE: return "Failure";
            default: return "Unknown";
        }
    }
}
