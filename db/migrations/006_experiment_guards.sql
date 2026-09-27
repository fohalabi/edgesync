CREATE UNIQUE INDEX IF NOT EXISTS one_running_experiment_per_rule ON experiments (target_rule_id) WHERE status = 'running';
