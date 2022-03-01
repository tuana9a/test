package vn.edu.hust.thread;

public class ThreadWorkerWithLock extends Thread {
    private ResourcesExploiterWithLock rExp;

    public ThreadWorkerWithLock(ResourcesExploiterWithLock rExp) {
        this.rExp = rExp;
    }

    @Override
    public void run() {
        for (int i = 0; i < 1000; i++) {
            rExp.exploit();
        }
    }
}
