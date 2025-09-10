#include "api_controller.h"

namespace time::gateway::controllers {

nlohmann::json ApiController::health() {
	return nlohmann::json{{"status", "ok"}};
}

}
