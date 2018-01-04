package com.zf_lab.express.tasks;

import com.zf_lab.express.domain.Goods;
import com.zf_lab.express.persistance.GoodsDAO;
import com.zf_lab.express.util.SpringTool;

import java.io.*;
import java.net.Socket;

public class ServerThread implements Runnable{

    public static Boolean isRunning = true;
    private Socket socket = null;

    public ServerThread(Socket socket) {
        this.socket = socket;
    }

    @Override
    public void run() {
        GoodsDAO goodsStorage = (GoodsDAO) SpringTool.getBean("goodsDAO");

        InputStream is = null;
        InputStreamReader isr = null;
        BufferedReader br = null;
        OutputStream os = null;
        PrintWriter pw = null;
        try {
            is = socket.getInputStream();
            isr = new InputStreamReader(is,"UTF-8");
            br = new BufferedReader(isr);
            String data;
            while((data=br.readLine()) != null && isRunning) {
                System.out.println("###Client Post Data:" + data);
                try {
                    int indexBarcode = data.indexOf("barcode");
                    int indexStation = data.indexOf("station");
                    int indexEnd = data.indexOf("END");

                    String barcode = data.substring(indexBarcode+8, indexStation);
                    String station = data.substring(indexStation+8, indexEnd);
                    System.out.println("  barcode:" + barcode);
                    System.out.println("  station:" + station);
                    //TEMP CHANGE FOR DEMO
                    station = "ECUST-Station";
                    //END

                    Goods g;
                    try {
                        g = new Goods(barcode, station);
                        System.out.println("  Goods:" + g.toString());
                    }catch (Exception e) {
                        System.out.println("new goods error:" + e.toString());
                        continue;
                    }
                    try {
                        goodsStorage.saveGoods(g);
                    }catch (Exception e) {
                        System.out.println("save goods error:" + e.toString());
                    }
                    System.out.println("  DONE");

                }catch (Exception e) {
                    System.out.println("parse send data string:" + e.toString());
                }
            }
            socket.shutdownInput();
            System.out.println("---Stop One Thread With TCP Server");
            os = socket.getOutputStream();
            pw = new PrintWriter(os);
            pw.write("###Server Responding Succeed!");
            pw.flush();

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if(pw!=null)
                    pw.close();
                if(os!=null)
                    os.close();
                if(br!=null)
                    br.close();
                if(isr!=null)
                    isr.close();
                if(is!=null)
                    is.close();
                if(socket!=null)
                    socket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }


}
