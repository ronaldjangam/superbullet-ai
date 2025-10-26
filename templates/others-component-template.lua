-- Others Component Template (Specialized logic)
-- File: ServerScriptService/ServiceName/Components/Others/DataValidator.lua

local DataValidator = {}

-- Example: Validate player data
function DataValidator:ValidatePlayerData(data: {[string]: any}): boolean
    if not data then return false end
    if not data.Level or type(data.Level) ~= "number" then return false end
    if not data.Experience or type(data.Experience) ~= "number" then return false end
    return true
end

-- Example: Sanitize input
function DataValidator:SanitizeString(input: string): string
    -- Remove special characters, SQL injection attempts, etc.
    return input:gsub("[^%w%s]", "")
end

-- Example: Validate transaction
function DataValidator:ValidateTransaction(player: Player, itemId: string, cost: number): boolean
    -- Check if player has enough currency
    -- Check if item exists
    -- Check if transaction is valid
    return true
end

return DataValidator
