package pdl.backend.repository;

import java.util.Arrays;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;


@Repository
public class ImageRepository{

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void add(String name, int[] histogram) {
        String sql = "INSERT INTO images (name, histogram) VALUES (?, ?::vector)";
        String histogramString = Arrays.toString(histogram);
        jdbcTemplate.update(sql, name, histogramString);
    }

    public String get(long id) {
        try {
            String sql = "SELECT name FROM images WHERE id = ?";
            return jdbcTemplate.queryForObject(sql, String.class, id+1);
        } catch (EmptyResultDataAccessException e) {
            System.out.println("No image found with id " + id);
            return null;
        }
    }

    public void delete(long id) {
        String sql = "DELETE FROM images WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public int size() {
        try {
            String sql = "SELECT COUNT(*) FROM images";
            return Integer.parseInt(jdbcTemplate.queryForObject(sql, String.class));
        } catch (EmptyResultDataAccessException e) {
            System.out.println("cant get table size");
            return -1;
        }
    }

    public void rebuild() {
        // Drop table
        jdbcTemplate.execute("DROP TABLE IF EXISTS images");

        // Create table
        jdbcTemplate.execute(
                "CREATE TABLE IF NOT EXISTS images (" +
                        "id bigserial PRIMARY KEY, " +
                        "name character varying(255)," +
                        "histogram VECTOR(360)"+
                        ")"
        );
    }
}