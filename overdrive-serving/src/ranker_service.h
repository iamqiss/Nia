#pragma once

#include <string>
#include <vector>
#include <unordered_map>

namespace overdrive {

struct RankFactor { std::string name; double value = 0.0; };
struct RankedItem {
	std::string note_id;
	double score = 0.0;
	std::vector<RankFactor> factors;
	std::vector<std::string> reasons;
};

class RankerServiceImpl {
public:
	std::vector<RankedItem> RankForYou(const std::string& user_id, const std::vector<std::string>& candidate_ids, int limit) {
		std::vector<RankedItem> out;
		out.reserve(candidate_ids.size());
		int idx = 0;
		for (const auto& id : candidate_ids) {
			RankedItem it; it.note_id = id; it.score = 1.0 - (0.001 * idx++);
			it.factors.push_back({"base", it.score});
			
			// Downrank if item likely contains external link (simple heuristic by id prefix or metadata elsewhere)
			double external_link_penalty = 0.0;
			if (id.rfind("http://", 0) == 0 || id.rfind("https://", 0) == 0 || id.find("::ext") != std::string::npos) {
				external_link_penalty = 0.12;
				it.score -= external_link_penalty;
			}
			it.factors.push_back({"external_link_penalty", external_link_penalty});
			it.reasons.push_back(external_link_penalty > 0.0 ? "external link downrank applied" : "coldstart");
			out.push_back(std::move(it));
		}
		if (limit > 0 && static_cast<int>(out.size()) > limit) out.resize(static_cast<size_t>(limit));
		return out;
	}
};

} // namespace overdrive