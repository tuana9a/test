package com.tuana9a.other;

public class StopWatch {

    protected long time1;
    protected long time2;

    public void start() {
        time1 = System.currentTimeMillis();
    }

    public void stop() {
        time2 = System.currentTimeMillis();
    }

    public void printTotalTime() {
        int delta = (int) ((time2 - time1) / 1000);
        int hour = 0;
        int minute = 0;
        int second = 0;

        minute = delta / 60;
        second = delta % 60;
        if (minute > 60) {
            int temp = minute;
            hour = temp / 60;
            minute = temp % 60;
        }

        System.out.printf("Total Time: %2s:%2s:%2s\n",
                hour >= 10 ? hour : "0" + hour,
                minute >= 10 ? minute : "0" + minute,
                second >= 10 ? second : "0" + second);
    }
}
