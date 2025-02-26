package pdl.backend.repository;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.FilenameFilter;
import java.util.Arrays;
import java.util.List;

@Repository
public class ImagesRepository implements InitializingBean{

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Value("${images.upload-dir}")
    private String uploadDir;

    @Override
    public void afterPropertiesSet() throws Exception {
        File dir = new File(uploadDir);
        if(!dir.exists()){
            throw new Exception("Directory ./images does not exist");
        }

        File[] files = dir.listFiles((dir1, name) -> (name.endsWith(".jpg") || name.endsWith(".png")));

        if(files == null){
            throw new Exception("No images found in ./images");
        }

        for(File file : files){
            System.out.println(file.getAbsolutePath());
        }
    }
}