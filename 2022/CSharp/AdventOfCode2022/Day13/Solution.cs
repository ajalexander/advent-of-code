namespace AdventOfCode2022.Day13;

public class Solution : SolutionBase
{
  public override int Day => 13;

  public Solution(bool exampleMode) : base(exampleMode)
  {
  }

  protected override void PerformPart1()
  {
    var pairs = GetPacketPairs();
    var sortedPairIndices = new List<int>();
    for (var i = 0; i < pairs.Count; i += 1)
    {
      if (InOrder(pairs[i]))
        sortedPairIndices.Add(i + 1);
    }
    
    var summedIndices = sortedPairIndices.Sum();

    Console.WriteLine("The sum of the sorted indices is {0}", summedIndices);
  }

  protected override void PerformPart2()
  {
  }

  private bool InOrder(PacketPair pair)
  {
    return pair.First.CompareTo(pair.Second) < 0;
  }

  private List<PacketPair> GetPacketPairs()
  {
    return GetInput()
      .Select(group => new PacketPair(ParsePacket(group[0]), ParsePacket(group[1])))
      .ToList();
  }

  private PacketItem ParsePacket(string input)
  {
    var root = new PacketItem();;

    var stack = new Stack<PacketItem>();
    stack.Push(root);

    foreach (var character in input.Skip(1))
    {
      switch (character)
      {
        case '[':
          var newLevel = new PacketItem();
          stack.Peek().Values.Add(newLevel);
          stack.Push(newLevel);
          break;
        case ']':
          stack.Pop();
          break;
        case ',':
          break;
        default:
          var newItem = new PacketItem(int.Parse(character.ToString()));
          stack.Peek().Values.Add(newItem);
          break;
      }
    }

    return root;
  }

  private List<List<string>> GetInput()
  {
    return ReadFileLineGroups(ExampleMode ? "example.txt" : "input.txt");
  }
}

public record PacketPair(PacketItem First, PacketItem Second);

public class PacketItem
{
  public int? Value {get; set; }

  public List<PacketItem> Values { get; private set; }

  public PacketItem(int value) : this()
  {
    Value = value;
  }

  public PacketItem()
  {
    Values = new List<PacketItem>();
  }

  public int CompareTo(PacketItem other)
  {
    if (Value.HasValue && other.Value.HasValue)
      return CompareValues(this, other);

    var thisList = AsListWrapped();
    var otherList = other.AsListWrapped();

    return CompareContents(thisList, otherList);
  }

  private int CompareValues(PacketItem first, PacketItem second)
  {
    if (first.Value < second.Value)
      return -1;
    if (first.Value > second.Value)
      return 1;
    return 0;
  }

  private int CompareContents(PacketItem first, PacketItem second)
  {
    var temp = first.Values.Zip(second.Values).ToList();
    foreach (var (firstItem, secondItem) in first.Values.Zip(second.Values))
    {
      var itemResult = firstItem.CompareTo(secondItem);
      if (itemResult != 0)
      {
        return itemResult;
      }
    }

    if (first.Values.Count < second.Values.Count)
      return -1;
    if (first.Values.Count > second.Values.Count)
      return 1;
    return 0;
  }

  private PacketItem AsListWrapped()
  {
    if (!this.Value.HasValue)
      return this;
    
    var wrapped = new PacketItem();
    wrapped.Values.Add(new PacketItem(this.Value.Value));
    return wrapped;
  }

  public override string ToString()
  {
    if (Value.HasValue)
      return Value.Value.ToString();
    
    return $"[{string.Join(",", Values.Select(value => value.ToString()))}]";
  }
}