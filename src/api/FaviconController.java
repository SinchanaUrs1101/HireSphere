package api;

import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.TimeUnit;

@RestController
public class FaviconController {

    private static final String SVG = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>"
            + "<rect width='100' height='100' fill='%23358'/>"
            + "<text x='50' y='60' font-size='50' text-anchor='middle' fill='white'>H</text>"
            + "</svg>";

    @GetMapping(value = "/favicon.ico", produces = "image/svg+xml")
    public ResponseEntity<String> favicon() {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(1, TimeUnit.DAYS))
                .contentType(MediaType.valueOf("image/svg+xml"))
                .body(SVG);
    }
}
