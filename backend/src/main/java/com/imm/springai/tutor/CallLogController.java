package com.imm.springai.tutor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * In-memory ring buffer of the last 50 API calls.
 * Populated manually by annotating controller methods or via AOP.
 * The UI's CallLogDrawer reads from this endpoint.
 */
@RestController
@RequestMapping("/api/tutor/calls")
public class CallLogController {

    private static final int MAX_ENTRIES = 50;
    private final ConcurrentLinkedQueue<CallEntry> log = new ConcurrentLinkedQueue<>();
    private final AtomicInteger count = new AtomicInteger(0);

    @GetMapping("/recent")
    public List<CallEntry> recent() {
        return new ArrayList<>(log);
    }

    /** Called by controller advice or manually after each request. */
    public void record(CallEntry entry) {
        if (log.size() >= MAX_ENTRIES) {
            log.poll();
        }
        log.offer(entry);
        count.incrementAndGet();
    }

    /** Simple data transfer object for a single call. */
    public record CallEntry(
            String endpoint,
            String method,
            Map<String, String> params,
            int statusCode,
            long latencyMs,
            Integer inputTokens,
            Integer outputTokens,
            String requestPreview,
            String responsePreview,
            String error,
            Instant timestamp
    ) {
        public Map<String, Object> toMap() {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("endpoint", endpoint);
            m.put("method", method);
            m.put("params", params);
            m.put("statusCode", statusCode);
            m.put("latencyMs", latencyMs);
            m.put("inputTokens", inputTokens);
            m.put("outputTokens", outputTokens);
            m.put("requestPreview", requestPreview);
            m.put("responsePreview", responsePreview);
            m.put("error", error);
            m.put("timestamp", timestamp.toString());
            return m;
        }
    }
}