package com.tuana9a;

import com.tuana9a.monitor.Monitor;
import com.tuana9a.other.StopWatch;
import com.tuana9a.other.Utility;


public class Main {
//    private static final String URL = "http://ipv4.download.thinkbroadband.com/1GB.zip";
//    private static final String URL = "http://212.183.159.230/512MB.zip";
//    private static final String URL = "https://www.quintic.com/software/sample_videos/Cricket%20Batting%20200fps.avi";
//        private static final String URL = "http://localhost/service/resource/img/favicon.ico";
    private static final String URL = "http://123.24.74.23/resource/file/mp4/akira_bike.mp4";

    public static void main(String[] args) throws Exception {
        StopWatch watch = new StopWatch();
        watch.start();

        Monitor monitor = Utility.download(URL, "akira_bike");
        if (monitor.isCrash()) System.out.println(Utility.toJson(monitor.getLogs()));

        watch.stop();
        watch.printTotalTime();
    }
}
