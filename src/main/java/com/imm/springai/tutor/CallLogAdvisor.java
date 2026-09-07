package com.imm.springai.tutor;

import org.springframework.stereotype.Component;

/**
 * No-op advisor placeholder. The real recording mechanism is manual
 * (controller advice) so we don't depend on Spring AI 2.x advisor internals
 * which can change between minor versions.
 */
@Component
public class CallLogAdvisor {
    // intentionally minimal — recording happens in controller advice
}