package com.tuana9a.thread;

public abstract class WorkerThread implements Runnable {
    public int id;
    public WorkerThread(int id) {
        this.id = id;
    }
}
