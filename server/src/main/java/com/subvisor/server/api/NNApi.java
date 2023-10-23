package com.subvisor.server.api;

import static com.subvisor.server.process.PythonRun.runNetwork;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import com.subvisor.server.models.Contour;

@RestController
@RequestMapping("/api/nn")
@CrossOrigin(origins = "http://localhost:1234")
public class NNApi {

    @GetMapping("/predict")
    public Contour predict(String path, String points) {
        String result = runNetwork(path, points);
        result = result != null ? result.trim() : "null";
        return new Contour(result);
    }
}
