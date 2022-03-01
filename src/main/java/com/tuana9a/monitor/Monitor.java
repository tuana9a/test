package com.tuana9a.monitor;

import java.util.ArrayList;
import java.util.Collection;

public class Monitor {
    private boolean isCrash = false;
    private boolean hasSmallError = false;
    private boolean isComplete = false;

    private final ArrayList<MonitorLog> logs = new ArrayList<>();

    public Monitor() {
    }

    public synchronized void onSmallError(MonitorLog monitorLog) {
        addLog(monitorLog);
        hasSmallError = true;
    }

    public synchronized void onCrash(MonitorLog monitorLog) {
        addLog(monitorLog);
        isCrash = true;
    }

    public synchronized void onComplete(MonitorLog monitorLog) {
        addLog(monitorLog);
        isComplete = true;
    }

    private void addLog(MonitorLog monitorLog) {
        logs.add(monitorLog);
    }

    public void addAllLog(Collection<? extends MonitorLog> collection) {
        logs.addAll(collection);
    }


    //checker
    public boolean isCrash() {
        return isCrash;
    }

    public boolean isPerfect() {
        return !isCrash && !hasSmallError;
    }

    public boolean isComplete() {
        return isComplete;
    }

    public boolean isAcceptable() {
        return !isCrash;
    }

    public boolean hasSmallError() {
        return hasSmallError;
    }


    //getter setter
    public ArrayList<MonitorLog> getLogs() {
        return logs;
    }
}
