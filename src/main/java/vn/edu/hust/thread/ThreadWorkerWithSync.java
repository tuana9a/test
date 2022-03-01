package vn.edu.hust.thread;

public class ThreadWorkerWithSync extends Thread {
    private final ResourcesExploiter rExp;

    public ThreadWorkerWithSync(ResourcesExploiter rExp) {
        this.rExp = rExp;
    }

    @Override
    public void run() {
        synchronized (rExp) {
            for (int i = 0; i < 1000; i++) {
                rExp.exploit();
            }
        }
    }
}
