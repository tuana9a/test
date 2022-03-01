package com.tuana9a.monitor;

public class WorkerThreadMonitor extends Monitor {
    private final int total;
    private int progress = 0;

    public WorkerThreadMonitor(int total) {
        super();
        this.total = total;
    }

    public int currentProgress() {
        return progress;
    }

    public synchronized void increaseProgress() {
        progress++;
        System.out.printf("loading... %-3.0f %%\n",((double) progress/total) * 100);
        if (progress >= total) {
            onComplete(new MonitorLog().append("type", "complete"));
            this.notify();
        }
    }
}
