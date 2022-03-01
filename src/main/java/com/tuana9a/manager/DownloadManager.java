package com.tuana9a.manager;

import com.tuana9a.monitor.Monitor;
import com.tuana9a.thread.WorkerThread;
import com.tuana9a.monitor.WorkerThreadMonitor;
import com.tuana9a.monitor.MonitorLog;
import com.tuana9a.other.Config;
import com.tuana9a.other.Utility;

import java.io.*;
import java.math.BigInteger;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

public class DownloadManager {
    public static Monitor separateDownload(String url, String name, String ext, int thread)
            throws Exception {

        WorkerThreadMonitor monitor = new WorkerThreadMonitor(thread);

        BigInteger fileSize;
        fileSize = getFullLength(url);
        BigInteger offset = fileSize.divide(BigInteger.valueOf(thread));
        BigInteger index = BigInteger.ZERO;

        for (int i = 0; i < thread; i++) {

            BigInteger startIdx = index;
            BigInteger finishIdx = i == (thread - 1) ? fileSize.subtract(BigInteger.ONE) : index.add(offset);

            new Thread(new WorkerThread(i) {
                @Override
                public void run() {
                    if (startIdx.compareTo(finishIdx) >= 0)
                        System.out.println("wrong bytes=" + startIdx + "-" + finishIdx);

                    File tempFolder = new File(
                            Config.TEMP_DOWNLOAD_FOLDER + File.separator
                                    + name + "-" + ext);
                    if (!tempFolder.exists()) {
                        boolean success = tempFolder.mkdir();
                        if (!success) {
                            System.out.println("worker(" + id + "), bytes=" + startIdx + "-" + finishIdx);
                            monitor.onCrash(new MonitorLog()
                                    .append("error", "Can't make folder " + tempFolder.getName()));
                            return;
                        }
                    }

                    File tempFile = new File(
                            Config.TEMP_DOWNLOAD_FOLDER + File.separator
                                    + name + "-" + ext + File.separator
                                    + name + "-" + id + "." + ext + ".temp");
                    if (!tempFile.exists()) {
                        boolean success = false;
                        try {
                            success = tempFile.createNewFile();
                        } catch (IOException ignored) {
                        }
                        if (!success) {
                            System.out.println("worker(" + id + "), bytes=" + startIdx + "-" + finishIdx);
                            monitor.onCrash(new MonitorLog()
                                    .append("error", "Can't make file " + tempFile.getName()));
                            return;
                        }
                    }

                    HttpURLConnection connection = null;
                    InputStream input = null;
                    FileOutputStream output = null;

                    try {
                        connection = (HttpURLConnection) new URL(url).openConnection();
                        connection.setRequestProperty("Range", "bytes=" + startIdx + "-" + finishIdx);
                        connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11");

                        connection.connect();
                        input = connection.getInputStream();
                        output = new FileOutputStream(tempFile);

                        byte[] bytes = new byte[Config._1MB_BUFFER_SIZE];
                        int read;
                        while ((read = input.read(bytes)) > 0) output.write(bytes, 0, read);

                    } catch (IOException e) {
                        e.printStackTrace();
                    } finally {
                        Utility.closeIgnoredException(input);
                        Utility.closeIgnoredException(output);
                        if (connection != null) connection.disconnect();
                    }

                    monitor.increaseProgress();
                }
            }).start();

            index = finishIdx.add(BigInteger.ONE);
        }

        return monitor;
    }

    public static Monitor combineTempFile(String outputFolder, String name, String ext, int thread)
            throws Exception {

        WorkerThreadMonitor monitor = new WorkerThreadMonitor(thread);

        File combinedFile = new File(outputFolder + File.separator + name + "." + ext);
        if (combinedFile.exists()) {
            boolean deleteSuccess = combinedFile.delete();
            if (!deleteSuccess) throw new IOException("Can't delete old file " + combinedFile.getName());
            boolean recreateFile = combinedFile.createNewFile();
            if (!recreateFile) throw new IOException("Can't create new file " + combinedFile.getName());
        }

        FileOutputStream output = new FileOutputStream(combinedFile, true);

        for (int i = 0; i < thread; i++) {
            File separatedFile = new File(
                    Config.TEMP_DOWNLOAD_FOLDER + File.separator
                            + name + "-" + ext + File.separator
                            + name + "-" + i + "." + ext + ".temp"
            );

            FileInputStream input = new FileInputStream(separatedFile);

            byte[] bytes = new byte[Config._1MB_BUFFER_SIZE];
            int read;

            while ((read = input.read(bytes)) > 0) {
                output.write(bytes, 0, read);
            }

            Utility.closeIgnoredException(input);

            boolean deleteSuccess = separatedFile.delete();
            if (!deleteSuccess) throw new IOException("Can't delete separate file " + separatedFile.getName());
            monitor.increaseProgress();
        }

        Utility.closeIgnoredException(output);

        System.out.println("combined successfully to \""
                + outputFolder + File.separator
                + name + "." + ext + "\""
        );

        return monitor;
    }

    public static BigInteger getFullLength(String url)
            throws Exception {

        HttpURLConnection connection = (HttpURLConnection)  new URL(url).openConnection();
        connection.setRequestProperty("User-Agent",
                "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11");
        Map<String, List<String>> headerFields = connection.getHeaderFields();
        BigInteger contentLength = new BigInteger((headerFields.get("Content-Length").get(0)));
        connection.disconnect();

        return contentLength;
    }
}
