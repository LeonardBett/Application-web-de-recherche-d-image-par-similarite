package pdl.backend.service;

import boofcv.struct.image.GrayU8;
import boofcv.alg.color.ColorHsv;
import boofcv.struct.image.Planar;


public class HistoSort {

    public static void histo(Planar<GrayU8> input, int[] result){
        int[] tab=new int[360];
        for (int i=0; i<input.width; ++i){
          for (int j=0;j<input.height; ++j){
            float r=input.getBand(0).get(i,j);
            float g=input.getBand(1).get(i,j);
            float b=input.getBand(2).get(i,j);
            float[] hsv=new float[3];
            ColorHsv.rgbToHsv(r,g,b,hsv);
            tab[(int) (hsv[0]*(180f/(float) Math.PI))] ++;
          }
        }
        int max = 0;
        for(int i=0; i<tab.length; i++){
          if(tab[i]>max){
            max=tab[i];
          }
        }
        for(int i=0; i<tab.length; i++){
            result[i]=tab[i]/max;
        }
    }

}
