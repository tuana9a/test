package vn.edu.hust.thread;

public class MainWithLock {
    public static void main(String[] args) throws InterruptedException {
        ResourcesExploiterWithLock resource = new ResourcesExploiterWithLock(0);

        Thread worker1 = new ThreadWorkerWithLock(resource);
        Thread worker2 = new ThreadWorkerWithLock(resource);
        Thread worker3 = new ThreadWorkerWithLock(resource);

        worker1.start();
        worker2.start();
        worker3.start();

        worker1.join();
        worker2.join();
        worker3.join();

        System.out.println(resource.getRsc());
    }
}
