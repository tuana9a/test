package vn.edu.hust.thread;

public class ThreadWorkerWithoutSync extends Thread {
    private final ResourcesExploiter rExp;

    public ThreadWorkerWithoutSync(ResourcesExploiter rExp) {
        this.rExp = rExp;
    }

    @Override
    public void run() {
        for (int i = 0; i < 1000; i++) {
            rExp.exploit();
        }
    }
}
