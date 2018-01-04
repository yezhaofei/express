package com.zf_lab.express.tasks;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.io.IOException;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Timer;
import java.util.TimerTask;

public class AppServletContextListener implements ServletContextListener{

    private ServerSocket serverSocket;
    private boolean isRunning = true;


    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("<------------------- system start ------------------->");
        ServerThread.isRunning = true;
        long delay = 1000 * 10;
        Timer timer = new Timer(true);
        timer.schedule(new startTcpServer(), delay);
    }


    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("<------------------ system shutdown ------------------>");
        isRunning = false;
        ServerThread.isRunning = false; //ACTUALLY WE DON'T NEED TO DO THIS
        System.out.println("<-------------- TCP server is stopping... ------------>");
        try {
            //SHOULD DEAL WITH serverSocket.accept(); Try to cancel this process
            serverSocket.close();
        } catch (Exception e) {
            System.out.println("###Socket Close Exception:" + e.toString());
        }
    }


    public class startTcpServer extends TimerTask {

        @Override
        public void run() {
            runTcpServer();
        }

        private void runTcpServer() {
            try {
                serverSocket = new ServerSocket(12000);
                Socket socket;
                int count = 0;
                System.out.println("###TCP Server is Started, Wait For Client Connect...");

                while (isRunning) {
                    socket = serverSocket.accept();
                    Thread thread = new Thread(new ServerThread(socket));
                    thread.start();

                    count++;
                    System.out.println("###Server Connected Count:" + count);
                    InetAddress address = socket.getInetAddress();
                    System.out.println("###Current Client IP:" + address.getHostAddress());
                }
                serverSocket.close();

            } catch (IOException e) {
                e.printStackTrace();
                System.out.println("###This exception is on expectation");
            }
        }
    }


}
