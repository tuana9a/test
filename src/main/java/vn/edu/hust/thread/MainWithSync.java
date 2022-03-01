package vn.edu.hust.thread;

public class MainWithSync {
    public static void main(String[] args) throws InterruptedException {
        ResourcesExploiter resource = new ResourcesExploiter(0);

        Thread worker1 = new ThreadWorkerWithSync(resource);
        Thread worker2 = new ThreadWorkerWithSync(resource);
        Thread worker3 = new ThreadWorkerWithSync(resource);

        worker1.start();
        worker2.start();
        worker3.start();

        worker1.join();
        worker2.join();
        worker3.join();

        System.out.println(resource.getRsc());
    }
}
