package vn.edu.hust.thread;

public class MainWithoutSync {
    public static void main(String[] args) throws Exception {
        ResourcesExploiter resource = new ResourcesExploiter(0);

        Thread worker1 = new ThreadWorkerWithoutSync(resource);
        Thread worker2 = new ThreadWorkerWithoutSync(resource);
        Thread worker3 = new ThreadWorkerWithoutSync(resource);

        worker1.start();
        worker2.start();
        worker3.start();

        worker1.join();
        worker2.join();
        worker3.join();

        System.out.println(resource.getRsc());
    }
}
