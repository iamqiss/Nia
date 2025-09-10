#pragma once
#include <nlohmann/json.hpp>
#include <string>

namespace time::gateway::controllers {

class ApiController {
public:
	nlohmann::json health();
};

}
