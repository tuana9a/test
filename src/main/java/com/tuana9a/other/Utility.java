package com.tuana9a.other;

import com.google.gson.Gson;
import com.tuana9a.manager.DownloadManager;
import com.tuana9a.monitor.Monitor;
import com.tuana9a.monitor.MonitorLog;

import java.io.Closeable;
import java.io.File;
import java.io.IOException;

public class Utility {
    private static final Gson gson = new Gson();

    public static String toJson(Object o) {
        return gson.toJson(o);
    }

    public static Monitor download(String url, String folder, String path, String ext, int thread)
            throws Exception {

        Monitor monitor = new Monitor();

        Monitor downloadMonitor = DownloadManager.separateDownload(url, path, ext, thread);

        synchronized (downloadMonitor) {
            downloadMonitor.wait();
        }
        monitor.addAllLog(downloadMonitor.getLogs());

        if (downloadMonitor.isCrash()) {
            monitor.onCrash(new MonitorLog()
                    .append("detail", "cant download: " + url));
            return monitor;
        }


        Monitor combineMonitor = DownloadManager.combineTempFile(folder, path, ext, thread);

        monitor.addAllLog(combineMonitor.getLogs());
        if (combineMonitor.isCrash()) {
            monitor.onCrash(new MonitorLog()
                    .append("type", "crash")
                    .append("detail", "cant combine: "
                            + Config.TEMP_DOWNLOAD_FOLDER + File.separator
                            + path + File.separator));
            return monitor;
        }

        monitor.onComplete(new MonitorLog().append("type", "complete"));
        return monitor;
    }

    public static Monitor download(String url, String name, String ext)
            throws Exception {
        return download(
                url,
                Config.DEFAULT_DOWNLOAD_FOLDER,
                name,
                ext,
                Config.DEFAULT_THREAD_NUMBER
        );
    }

    public static Monitor download(String url, String name)
            throws Exception {
        String fileExtension = "unknown";
        int lastIndexOfDot = url.lastIndexOf(".");
        if (lastIndexOfDot != -1) {
            fileExtension = url.substring(lastIndexOfDot + 1);
        }
        return download(
                url,
                Config.DEFAULT_DOWNLOAD_FOLDER,
                name,
                fileExtension,
                Config.DEFAULT_THREAD_NUMBER
        );
    }

    public static void closeIgnoredException(Closeable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (IOException ignored) {
            }
        }
    }
}
