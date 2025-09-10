# Kubernetes Observability for time

Namespace: `time-observability`

Apply manifests:
```bash
kubectl apply -f elk-core.yaml
kubectl apply -f beats-filebeat-daemonset.yaml
kubectl apply -f beats-metricbeat-daemonset.yaml
```

Then open Kibana via port-forward or ingress:
```bash
kubectl -n time-observability port-forward deploy/kibana 5601:5601
```

- Logs index: `time-logs-*`
- Metrics index: `metricbeat-*`

Filebeat autodiscovers pods and ships to ClusterIP `logstash.time-observability.svc:5044`. Metricbeat ships to `elasticsearch.time-observability.svc:9200`.